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
      lyric = self.find_lyric
      unless lyric[:lyrics].downcase.include?("not found")
        out = lyric
        content = self.get_full_lyric(lyric[:url])[:content]
        out[:content] = content
        return out
      end
      return {:content => nil}
    end

    protected
    def find_lyric
      params = "fmt=xml&artist=#{self.artist}&song=#{self.song}"
      xpaths = [{
        :exp => "//song",
        :name => :title,
        :select => lambda { |element| element.text }
      }, {
        :exp => "//lyrics",
        :name => :lyrics,
        :select => lambda { |element| element.text }
      }, {
        :exp => "//url",
        :name => :url,
        :select => lambda { |element| element.text }
      }] 
      return self.make_request(params, xpaths)
    end

    def get_full_lyric(url)
      return self.process_html(url, [{
        :exp => ".lyricbox", 
        :name => :content, 
        :select => lambda { |element|
          element.css(".rtMatcher").remove
          return element.inner_html 
        }
      }])
    end

  end
end