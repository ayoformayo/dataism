class MapsController < ApplicationController
  def new_york
    render :new_york
  end

  def ub_heat_map
    render :ub_heat_map
  end

  def mapped_communities
    render :chicago_language_props
  end
end
