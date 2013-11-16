var RdioMeta;
(function() {
  var serverUrl = "http://rdio-meta.herokuapp.com";
  var rdioUrl = "http://www.rdio.com";

  RdioMeta = {
    on: false,
    entities: ['article', 'lyrics', 'video', 'events'],
    setupDom: function() {
      // add stylesheet
      var css = $('#rdio-meta-css');
      if (css.length == 0) {
        $('body')
          .append('<link id="rdio-meta-css" rel="stylesheet" href="' + 
            serverUrl + '/css/rdio-meta.css" type="text/css" />');
      }
      // create elements
      var container = $('.RdioMetaContainer');
      if (container.length == 0) {
        var mainContent = $('.main_content');
        var mainContentOffset = mainContent.offset();
        container = $('<div></div>')
          .addClass('RdioMetaContainer')
          .css({left: 10, top: mainContentOffset.top+parseInt(mainContent.css('padding-top'))});
        $(document.body).append(container);
        this.resize();

        // stuff that needs to happen only once
        if (R.app.player) {
          R.app.player.listen(R.player, 'change:playingTrack', function() {
            if (RdioMeta.on) {
              RdioMeta.update();
            }
          });
        }
        $(window).resize(function() {
          RdioMeta.resize();
        });
      }
      _.each(this.entities, function(entity) {
        var element = container.find('.' + entity);
        if (element.length == 0) {
          element = $('<div><div class="content"></div>').addClass(entity);
          container.append(element);
        }
      });
    },
    extract: function() {
      var title = $('.App_PlayerFooter .song_title');
      var artist = $('.App_PlayerFooter .artist_title');
      return {artist: artist.text(), title: title.text()};
    },
    run: function(forceRefresh) {
      if (this.on) {
        $('.RdioMetaContainer').hide();
      } else {
        this.update();
      }
      this.on = !this.on;
      this.updateFavicon((this.on ? serverUrl : rdioUrl) + '/favicon.ico');
    },
    update: function() {
      $('.RdioMetaContainer').show();
      var current = this.extract();
      this.setupDom();
      _.each(this.entities, function(entity) {
        this.request(entity, current.artist, current.title);
      }, this);
    },
    resize: function() {
      var height = $(window).height();
      var newHeight = (height - $('.App_PlayerFooter').height() - $('.App_Header').height() - 40);
      $('.RdioMetaContainer').height(newHeight);
    },
    request: function(entity, artist, song) {
      var self = this;
      $.ajax({
        url: serverUrl + '/ws/get/' + entity + '?artist=' + artist + '&song=' + song,
        dataType: 'jsonp',
      }).done(function(data) {
        var content;
        if(entity == 'events') {
          content = self.getEventsText(data);
        } else {
          content = data.content;
          if (content) {
            if (entity == 'video') {
              var videoContainer = $('.video');
              content = self.getYouTubeEmbed(content, videoContainer.width()-40, videoContainer.height()-70);
            }
            if (data.title) {
              content = "<h1>" + data.title + "</h1>" + content;
            }
            if (data.url) {
              content += '<p><a href="' + data.url + '" target="_blank">' + data.url + '</a></p>';
            }
          } else {
            content = 
            "<p>" + entity + " not found. Why don't you" +
            " <a href='http://www.google.com/#q=" + artist + " " + song + " " + entity + 
            "'>google</a>?</p>";
          }
        }
        $('.RdioMetaContainer .' + entity + ' .content').html(content);
        $('.RdioMetaContainer .' + entity).show();
      });
    },
    getYouTubeEmbed: function(youtubeId, width, height) {
      return "<iframe width=\"" + width + "\" height=\"" + height + 
              "\" src=\"//www.youtube.com/embed/" + youtubeId + 
              "\" frameborder=\"0\" allowfullscreen></iframe>";
    },
    updateFavicon: function(src) {
      // clean up existing favicons
      $('link[rel="icon"], link[rel="icon shortcut"], #meta-favicon').remove();
      var link = 
        $('<link id="meta-favicon" rel="icon shortcut" type="image/x-icon"></link>')
          .attr('href', src);
      $('head').append(link);
      if (!window._iframe) {
        // chrome workaround to refresh favicon in the tab
        _iframe = $('<iframe></iframe>')
          .css({height: 0, width: 0, visibility: 'hidden'});
        $(document.body).append(_iframe);
      }
      _iframe.attr('src', 'about:blank');
    },
    getEventsText: function(list) {
      var result = '<h1>Events</h1>';
      if (list.length == 0) {
        result += "events not found";
      } else {
        result += "<ul>";
      }
      _.each(list, function(item) {
        result += '<li><a href="' + item.url + '">' + item.title + "</a>, " + item.date + "</li>";
      });
      result += '</ul>'
      return result;
    }
  };
  RdioMeta.run();
})();
