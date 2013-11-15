require 'nokogiri'
require 'open-uri'

module Query
  class Lyrics < Query::BaseSource

    attr_accessor :url, :artist, :song

    def initialize(artist, song)
      super(artist, song)
    end

    def api_url
      return "http://lyrics.wikia.com/api.php"
    end

    def result
      return self.find_lyric
    end

    protected
    def find_lyric
      params = "fmt=xml&artist=#{self.artist}&song=#{self.song}"
      xpaths = [{
        :exp => "//lyrics",
        :name => :content,
        :select => lambda { |element| element.text }
      }, {
        :exp => "//url",
        :name => :url,
        :select => lambda { |element| element.text }
      }]
      return self.make_request(params, xpaths)
    end

  end
end