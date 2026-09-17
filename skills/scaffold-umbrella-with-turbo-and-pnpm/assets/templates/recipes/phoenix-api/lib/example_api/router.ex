defmodule ExampleApi.Router do
  use Plug.Router

  plug :match
  plug Plug.Parsers, parsers: [:json], json_decoder: Jason
  plug :dispatch

  @store :example_api_store

  get "/healthz" do
    send_json(conn, 200, %{status: "ok"})
  end

  get "/value" do
    send_json(conn, 200, Agent.get(@store, & &1))
  end

  put "/value" do
    value = conn.body_params["value"]
    row = %{value: value, updatedAt: DateTime.utc_now() |> DateTime.to_iso8601()}
    Agent.update(@store, fn _ -> row end)
    send_json(conn, 200, row)
  end

  match _ do
    send_json(conn, 404, %{error: "not found"})
  end

  defp send_json(conn, status, body) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(status, Jason.encode!(body))
  end
end
