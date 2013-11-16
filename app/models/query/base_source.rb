module Query
  class BaseSource

    attr_accessor :url, :artist, :song, :searchterm

    def initialize(artist, song)
      self.artist = artist
      self.song = song
    end

    def api_url; end # return API url string

    def result; end # implement this

    #
    # xpath => a list of xpath objects 
    # e.g. {:exp => "//items/item", :name => :content, :select => lambda { |n| n.text }}
    #
    def make_request(params, xpath_objects)
      result = {}
      api_query = "#{self.api_url}?#{URI.encode(params)}"
      document = Nokogiri::XML(open(api_query))
      document.remove_namespaces!

      xpath_objects.each do |item|
        selected = document.xpath( item[:exp] )
        if selected.size > 0
          result[item[:name]] = item[:select].call(selected[0])
        end
      end
      return result
    end

    def process_html(url, selector_objects)
      result = {}
      document = Nokogiri::HTML(open(url))

      selector_objects.each do |item|
        selected = document.css( item[:exp] )
        if selected.size > 0
          result[item[:name]] = item[:select].call(selected[0])
        end
      end
      return result
    end

  end
end