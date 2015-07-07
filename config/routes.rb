Rails.application.routes.draw do
  get "/liquor_licenses"    => "liquor_licenses#show"
  get "/slack"              => "liquor_licenses#slack"
  get "/maps/new_york"      => "maps#new_york"
  get "/maps/ub_heat_map"   => "maps#ub_heat_map"

  root to: "welcome#index"
end
