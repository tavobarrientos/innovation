using Azure.Search.Documents;
using Azure.Storage.Blobs;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment()) // Load user secrets in development environment
{
    builder.Configuration.AddUserSecrets<Program>();
}

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Azure Blob Storage
builder.Services.AddSingleton(x => new BlobServiceClient(builder.Configuration.GetValue<string>("BlobStorage:ConnectionString")));

// Register Azure SearchClient
builder.Services.AddScoped(x =>
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
