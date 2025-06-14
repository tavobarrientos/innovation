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
