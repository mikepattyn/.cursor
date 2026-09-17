namespace ExampleBff;

public sealed record AppConfig(Uri CalculatorUrl, TimeSpan UpstreamTimeout)
{
    public static AppConfig FromEnvironment()
    {
        var raw = (Environment.GetEnvironmentVariable("CALCULATOR_URL") ?? "http://localhost:8081").TrimEnd('/');
        if (!Uri.TryCreate(raw, UriKind.Absolute, out var url))
        {
            throw new InvalidOperationException($"CALCULATOR_URL must be an absolute URL, got {raw}");
        }

        var timeoutSeconds = int.TryParse(Environment.GetEnvironmentVariable("UPSTREAM_TIMEOUT_S"), out var parsed)
            ? parsed
            : 5;
        return new AppConfig(url, TimeSpan.FromSeconds(timeoutSeconds));
    }
}
