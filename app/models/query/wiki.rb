require 'nokogiri'
require 'open-uri'

module Query
  class Wiki < Query::BaseSource

    def initialize(artist, song)
      super(artist, song)
      self.searchterm = "#{self.artist} #{self.song}"
    end

    def api_url
      return "http://en.wikipedia.org/w/api.php"
    end

    def result
      return "" if self.searchterm.blank?

      page_name = self.find_wiki_page_name[:page_name]
      return self.get_page_content(page_name)
    end

    protected
    def find_wiki_page_name
      params = "action=query&list=search&srprop=timestamp&format=xml&srsearch=#{self.searchterm}"
      xpath = {
        :exp => "//search//p",
        :name => :page_name,
        :select => lambda { |element| element['title'] }
      }
      return self.make_request(params, [xpath])
    end

    def get_page_content(page_name)
      params = "action=query&prop=extracts&rvprop=content&format=xml&redirects=true&titles=#{page_name}"
      xpath = {
        :exp => "//page//extract",
        :name => :content,
        :select => lambda { |element| element.text }
      }
      return self.make_request(params, [xpath])
    end

  end
end