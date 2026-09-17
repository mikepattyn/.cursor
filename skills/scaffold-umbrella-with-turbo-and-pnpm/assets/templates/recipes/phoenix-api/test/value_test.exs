defmodule ExampleApi.ValueTest do
  use ExUnit.Case, async: true

  test "empty get shape" do
    row = %{value: nil, updatedAt: nil}
    assert row.value == nil
  end

  test "put shape" do
    row = %{value: 12, updatedAt: "2026-01-01T00:00:00Z"}
    assert row.value == 12
  end
end
