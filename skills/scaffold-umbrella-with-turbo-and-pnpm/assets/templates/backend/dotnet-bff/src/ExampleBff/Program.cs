using ExampleBff;

var builder = WebApplication.CreateBuilder(args);
var config = AppConfig.FromEnvironment();

builder.Services.AddSingleton(config);
builder.Services.AddHttpClient("calculator", (sp, client) =>
{
    var appConfig = sp.GetRequiredService<AppConfig>();
    client.BaseAddress = new Uri(appConfig.CalculatorUrl.ToString().TrimEnd('/') + "/");
    client.Timeout = appConfig.UpstreamTimeout;
});
builder.Logging.ClearProviders();
builder.Logging.AddJsonConsole();

var app = builder.Build();

app.MapGet("/healthz", () => Results.Json(new { status = "ok" }));
app.MapGet("/readyz", async (IHttpClientFactory factory) =>
{
    try
    {
        var client = factory.CreateClient("calculator");
        using var response = await client.GetAsync("healthz");
        return response.IsSuccessStatusCode
            ? Results.Json(new { status = "ok" })
            : Results.Json(new { status = "unavailable" }, statusCode: 503);
    }
    catch
    {
        return Results.Json(new { status = "unavailable" }, statusCode: 503);
    }
});

app.MapMethods("/api/calculator/value", new[] { "GET", "PUT" }, async (
    HttpContext context,
    IHttpClientFactory factory) =>
{
    var client = factory.CreateClient("calculator");
    using var upstream = new HttpRequestMessage(new HttpMethod(context.Request.Method), "value");
    if (HttpMethods.IsPut(context.Request.Method))
    {
        upstream.Content = new StreamContent(context.Request.Body);
        if (context.Request.ContentType is { } contentType)
        {
            upstream.Content.Headers.ContentType =
                System.Net.Http.Headers.MediaTypeHeaderValue.Parse(contentType);
        }
    }

    if (context.Request.Headers.TryGetValue("x-request-id", out var requestId))
    {
        upstream.Headers.TryAddWithoutValidation("x-request-id", requestId.ToString());
    }

    try
    {
        using var response = await client.SendAsync(upstream);
        var body = await response.Content.ReadAsStringAsync();
        return Results.Content(body, "application/json", statusCode: (int)response.StatusCode);
    }
    catch (Exception)
    {
        return Results.Json(new { error = "calculator unavailable" }, statusCode: 502);
    }
});

app.Run();

public partial class Program;
