using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs;
using Microsoft.Extensions.Logging;

namespace Functions
{    public class ChunkDocumentFunction
    {
        private readonly ILogger _logger;
        private readonly BlobServiceClient _blobServiceClient;

        public ChunkDocumentFunction(ILoggerFactory loggerFactory, BlobServiceClient blobServiceClient)
        {
            _logger = loggerFactory.CreateLogger<ChunkDocumentFunction>();
            _blobServiceClient = blobServiceClient;
        }        [Function("ChunkDocument")]
        public async Task Run(
            [BlobTrigger("documents/{name}", Connection = "AzureWebJobsStorage")] Stream blobStream,
            string name)
        {
            _logger.LogInformation($"ChunkDocument function processing blob: {name}");
            _logger.LogInformation($"Blob size: {blobStream.Length} bytes");

            // Example of using the injected BlobServiceClient
            var containerClient = _blobServiceClient.GetBlobContainerClient("documents");
            var blobClient = containerClient.GetBlobClient(name);
            
            // You can now use blobClient for additional operations like:
            // - Getting blob properties
            // - Creating new blobs (e.g., processed chunks)
            // - Moving/copying blobs
            var properties = await blobClient.GetPropertiesAsync();
            _logger.LogInformation($"Blob content type: {properties.Value.ContentType}");

            // Add your document chunking logic here
            // For example, you can read the blob content and process it
            using var reader = new StreamReader(blobStream);
            var content = await reader.ReadToEndAsync();
            
            _logger.LogInformation($"Successfully processed document: {name}");
        }
    }
}
