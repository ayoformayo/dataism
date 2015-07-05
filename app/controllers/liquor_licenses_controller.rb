class LiquorLicensesController < ApplicationController
  def show
    render :show
  end

  def slack
    render :slack
  end
end
