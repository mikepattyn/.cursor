require "minitest/autorun"
require_relative "../app/controllers/values_controller"

class ValuesControllerTest < Minitest::Test
  def setup
    MemoryStore.instance.instance_variable_set(:@row, { value: nil, updatedAt: nil })
  end

  def test_empty_get
    assert_nil MemoryStore.instance.get[:value]
  end

  def test_put
    row = MemoryStore.instance.put(12)
    assert_equal 12, row[:value]
    assert row[:updatedAt]
  end
end
