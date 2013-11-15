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
        container = $('<div></div>').addClass('RdioMetaContainer');
        $(document.body).append(container);
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
        $('.RdioMetaContainer .' + entity).html(data.content);
      });
    }
  };
  RdioMeta.run();
})();
