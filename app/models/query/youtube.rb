require 'nokogiri'
require 'open-uri'

module Query
  class Youtube < Query::BaseSource
  	
  	api_browser_key = 'AIzaSyDQCAcFXnyDegAWsiPXd2LuaHQYOseAFvE'

    attr_accessor :url, :artist, :song

    def initialize(artist, song)
      super(artist, song)
      self.searchterm = "#{self.artist} #{self.song}"
    end

    def api_url
      return "https://gdata.youtube.com/feeds/api/videos"
    end

    def result
      video_info = self.find_video_info
      video_info[:content] = self.get_video_id(video_info[:url])
      return video_info
    end

    protected
    def find_video_info
      params = "q=#{self.searchterm}"
      xpaths = [{
        :exp => "//entry//id",
        :name => :url,
        :select => lambda { |element| element.text }
      }, {
        :exp => "//entry//title",
        :name => :title,
        :select => lambda { |element| element.text }
      }]
      return self.make_request(params, xpaths)
    end

    def get_video_id(video_url)
      return video_url.split("/").last
    end

  end
end