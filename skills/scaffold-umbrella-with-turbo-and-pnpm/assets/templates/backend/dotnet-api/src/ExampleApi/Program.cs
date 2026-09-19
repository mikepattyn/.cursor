using ExampleApi;

var builder = WebApplication.CreateBuilder(args);
var config = AppConfig.FromEnvironment();
builder.Services.AddSingleton(config);
builder.Services.AddSingleton<CalculatorStore>();
builder.Logging.ClearProviders();
builder.Logging.AddJsonConsole();

var app = builder.Build();

app.MapGet("/healthz", () => Results.Json(new { status = "ok" }));
app.MapGet("/readyz", (CalculatorStore store) =>
    store.Ready()
        ? Results.Json(new { status = "ok" })
        : Results.Json(new { status = "unavailable" }, statusCode: 503));

app.MapGet("/api/calculator/value", (CalculatorStore store) =>
{
    try
    {
        return Results.Json(store.Get());
    }
    catch
    {
        return Results.Json(new { error = "read failed" }, statusCode: 500);
    }
});

app.MapPut("/api/calculator/value", async (HttpContext context, CalculatorStore store) =>
{
    ValueBody? body;
    try
    {
        body = await context.Request.ReadFromJsonAsync<ValueBody>();
    }
    catch
    {
        return Results.Json(new { error = "invalid body" }, statusCode: 400);
    }

    if (body is null || !double.IsFinite(body.Value))
    {
        return Results.Json(new { error = "invalid body" }, statusCode: 400);
    }

    try
    {
        return Results.Json(store.Put(body.Value));
    }
    catch
    {
        return Results.Json(new { error = "write failed" }, statusCode: 500);
    }
});

app.Run();

public sealed record ValueBody(double Value);

public partial class Program;
