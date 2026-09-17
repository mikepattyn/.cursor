defmodule ExampleApi.MixProject do
  use Mix.Project

  def project do
    [
      app: :example_api,
      version: "0.0.0",
      elixir: "~> 1.17",
      deps: [
        {:phoenix, "1.7.18"},
        {:jason, "1.4.4"},
        {:plug_cowboy, "2.7.2"}
      ]
    ]
  end

  def application do
    [extra_applications: [:logger]]
  end
end
