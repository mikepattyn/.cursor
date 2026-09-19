FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Directory.Build.props Directory.Packages.props ExampleApi.sln ./
COPY src/ExampleApi/ExampleApi.csproj src/ExampleApi/
COPY tests/ExampleApi.Tests/ExampleApi.Tests.csproj tests/ExampleApi.Tests/
RUN dotnet restore --locked-mode || dotnet restore
COPY . .
RUN dotnet publish src/ExampleApi/ExampleApi.csproj -c Release -o /app --no-restore || \
    dotnet publish src/ExampleApi/ExampleApi.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
RUN useradd --system --uid 10001 app \
 && mkdir -p /data \
 && chown app:app /data
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://0.0.0.0:3000
ENV SQLITE_PATH=/data/calculator.db
EXPOSE 3000
USER app
ENTRYPOINT ["dotnet", "ExampleApi.dll"]
