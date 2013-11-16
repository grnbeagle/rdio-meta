require 'nokogiri'
require 'open-uri'

module Query
  class Concerts < Query::BaseSource

    def initialize(artist, song=nil)
      super(artist, song)
    end

    def api_url
      return "http://api.bandsintown.com/artists/#{URI::encode(self.artist)}/events.xml"
    end

    def result
      params = "api_version=2.0&app_id=rdio-meta"
      concert_info = self.make_request(params, 10)
      return concert_info
    end

    protected
    def make_request(params, count)
      result = []
      api_query = "#{self.api_url}?#{params}"
      params = URI::encode(api_query)
      document = Nokogiri::XML(open(api_query))

      selected = document.xpath("//event")
      selected.each_with_index do |node, index|
        result << {
            :title => node.xpath("title").text,
            :location => node.xpath("formatted_location").text,
            :date => node.xpath("formatted_datetime").text,
            :url => node.xpath("ticket_url").text
        }
        break if index >= count
      end
      return result
    end

  end
end