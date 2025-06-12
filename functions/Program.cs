using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

// Register Azure Blob Storage client
builder.Services.AddSingleton(x =>
{
    var connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage") ??
                          builder.Configuration.GetConnectionString("AzureWebJobsStorage") ??
                          "UseDevelopmentStorage=true";
    return new BlobServiceClient(connectionString);
});

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Build().Run();
