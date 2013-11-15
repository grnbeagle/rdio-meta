var RdioMeta;
(function() {
  var serverUrl = "http://localhost:3000";
  RdioMeta = {
    setupDom: function() {
      // add stylesheet
      var css = $('#rdio-meta-css');
      if (css.length == 0) {
        $('body').append('<link id="rdio-meta-css" rel="stylesheet" href="' + serverUrl + '/css/rdio-meta.css" type="text/css" />');
      }

      // create elements
      var container = $('.RdioMetaContainer');
      if (container.length == 0) {
        var mainContent = $('.main_content');
        var mainContentOffset = mainContent.offset();
        container = $('<div></div>')
          .addClass('RdioMetaContainer')
          .css({left: mainContentOffset.left, top: mainContentOffset.top+parseInt(mainContent.css('padding-top'))});
        $(document.body).append(container);

        if (R.app.player) {
          R.app.player.listen(R.player, 'change:playingTrack', function() {
            RdioMeta.run();
          });
        }
      }

      var wiki = container.find('.article');
      if (wiki.length == 0) {
        wiki = $('<div></div>').addClass('article');
        container.append(wiki);
      }

      var lyrics = container.find('.lyrics');
      if (lyrics.length == 0) {
        lyrics = $('<div></div>').addClass('lyrics');
        container.append(lyrics);
      }
    },
    extract: function() {
      var title = $('.App_PlayerFooter .song_title');
      var artist = $('.App_PlayerFooter .artist_title');
      return {artist: artist.text(), title: title.text()};
    },
    run: function() {
      var current = this.extract();
      this.setupDom();
      this.request('article', current.artist, current.title);
      this.request('lyrics', current.artist, current.title);
    },
    request: function(entity, artist, song) {
      $.ajax({
        url: serverUrl + '/ws/get/' + entity + '?artist=' + artist + '&song=' + song,
        dataType: 'jsonp',
      }).done(function(data) {
        if (data.url) {
          $('.RdioMetaContainer .' + entity).html(
            data.content + '<p>' + 
            '<a href="' + data.url + '" target="_blank">' + data.url + '</a></p>'
          );
        } else {
          $('.RdioMetaContainer .' + entity).html(data.content);
        }
        $('.RdioMetaContainer .' + entity).css({display: 'inline-block'});
      });
    }
  };
  RdioMeta.run();
})();
