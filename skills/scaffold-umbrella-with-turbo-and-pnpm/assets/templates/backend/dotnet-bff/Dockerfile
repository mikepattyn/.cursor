FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY Directory.Build.props Directory.Packages.props ExampleBff.sln ./
COPY src/ExampleBff/ExampleBff.csproj src/ExampleBff/
COPY tests/ExampleBff.Tests/ExampleBff.Tests.csproj tests/ExampleBff.Tests/
RUN dotnet restore --locked-mode || dotnet restore
COPY . .
RUN dotnet publish src/ExampleBff/ExampleBff.csproj -c Release -o /app --no-restore || \
    dotnet publish src/ExampleBff/ExampleBff.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
RUN apt-get update && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/* \
 && useradd --system --uid 10001 app
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://0.0.0.0:3000
ENV CALCULATOR_URL=http://localhost:8081
EXPOSE 3000
USER app
ENTRYPOINT ["dotnet", "ExampleBff.dll"]
