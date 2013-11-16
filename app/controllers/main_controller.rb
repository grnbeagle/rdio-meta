class MainController < ApplicationController

  def index
    render "main/index", :layout => "application"
  end

end