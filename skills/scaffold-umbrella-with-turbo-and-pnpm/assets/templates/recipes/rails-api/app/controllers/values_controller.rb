class ValuesController < ActionController::API
  def show
    render json: store.get
  end

  def update
    value = params.require(:value)
    render json: store.put(value.to_f)
  end

  private

  def store
    @store ||= MemoryStore.instance
  end
end

class MemoryStore
  def self.instance
    @instance ||= new
  end

  def initialize
    @row = { value: nil, updatedAt: nil }
  end

  def get
    @row
  end

  def put(value)
    @row = { value: value, updatedAt: Time.now.utc.iso8601 }
  end
end
