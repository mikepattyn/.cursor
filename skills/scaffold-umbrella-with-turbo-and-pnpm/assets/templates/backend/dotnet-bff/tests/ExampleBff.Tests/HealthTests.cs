using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ExampleBff.Tests;

public class HealthTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public HealthTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task HealthzReturnsOk()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/healthz");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("ok", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task CalculatorUnavailableReturnsBadGateway()
    {
        var factory = _factory.WithWebHostBuilder(_ =>
        {
            Environment.SetEnvironmentVariable("CALCULATOR_URL", "http://127.0.0.1:1");
        });
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/calculator/value");
        Assert.Equal(HttpStatusCode.BadGateway, response.StatusCode);
    }
}
