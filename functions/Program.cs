using Azure.Storage.Blobs;
using Azure.Search.Documents;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment()) // Add user secrets in development environment
{
    builder.Configuration.AddUserSecrets<Program>();
}

builder.ConfigureFunctionsWebApplication();

// Register Azure Blob Storage client
builder.Services.AddSingleton(x =>
{
    var connectionString = Environment.GetEnvironmentVariable("BlobStorage:ConnectionString") ??
                          builder.Configuration.GetValue<string>("BlobStorage:ConnectionString") ??
                          "UseDevelopmentStorage=true";
    return new BlobServiceClient(connectionString);
});

// Register Azure SearchClient as singleton
builder.Services.AddSingleton(x =>
{
    var configuration = x.GetRequiredService<IConfiguration>();
    var endpoint = configuration["AzureSearch:Endpoint"] ?? "";
    var key = configuration["AzureSearch:ApiKey"] ?? "";
    var indexName = configuration["AzureSearch:IndexName"] ?? "";
    if (string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(indexName))
        throw new InvalidOperationException("Azure Search configuration is missing.");
    var credential = new Azure.AzureKeyCredential(key);
    return new SearchClient(new Uri(endpoint), indexName, credential);
});

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Build().Run();
