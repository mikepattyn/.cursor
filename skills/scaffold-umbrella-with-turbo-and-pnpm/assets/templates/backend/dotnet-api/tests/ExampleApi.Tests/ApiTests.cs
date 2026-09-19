using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ExampleApi.Tests;

public class ApiTests
{
    private static WebApplicationFactory<Program> Factory()
    {
        var db = Path.Combine(Path.GetTempPath(), $"calc-{Guid.NewGuid():N}.db");
        Environment.SetEnvironmentVariable("SQLITE_PATH", db);
        return new WebApplicationFactory<Program>();
    }

    [Fact]
    public async Task EmptyGetReturnsNullValue()
    {
        using var factory = Factory();
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/calculator/value");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal(JsonValueKind.Null, json.RootElement.GetProperty("value").ValueKind);
    }

    [Fact]
    public async Task PutThenGetPersistsValue()
    {
        using var factory = Factory();
        var client = factory.CreateClient();
        var put = await client.PutAsJsonAsync("/api/calculator/value", new { value = 12d });
        Assert.Equal(HttpStatusCode.OK, put.StatusCode);
        var got = await client.GetFromJsonAsync<JsonElement>("/api/calculator/value");
        Assert.Equal(12, got.GetProperty("value").GetDouble());
    }

    [Fact]
    public async Task HealthzAndReadyzReturnOk()
    {
        using var factory = Factory();
        var client = factory.CreateClient();
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/healthz")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/readyz")).StatusCode);
    }
}
