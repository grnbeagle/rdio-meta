class ApiController < ApplicationController
  include ActionView::Helpers::JavaScriptHelper

  respond_to :json

  def get
    case params[:entity]
    when "article"
      query = Query::Wiki.new(params[:artist], params[:song])
    when "lyrics"
      query = Query::Lyrics.new(params[:artist], params[:song])
    when "video"
      query = Query::Youtube.new(params[:artist], params[:song])
    when "events"
      query = Query::Concerts.new(params[:artist], params[:song])
    end
    render json: query.result, :callback => params[:callback]
  end

end