Rails.application.routes.draw do
  get "/healthz", to: proc { [200, { "content-type" => "application/json" }, ['{"status":"ok"}']] }
  get "/value", to: "values#show"
  put "/value", to: "values#update"
end
