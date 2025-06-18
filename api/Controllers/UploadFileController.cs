using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Route("api/upload")]
[ApiController]
public class UploadFileController(BlobServiceClient blobServiceClient, IConfiguration configuration) : ControllerBase
{
    readonly string containerName = configuration["BlobStorage:ContainerName"] ?? "documents";
    [HttpPost("{fileType:alpha:required}")]
    public async Task<IActionResult> UploadFile([FromBody]IFormFile file, [FromRoute]string fileType)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

        await containerClient.CreateIfNotExistsAsync();

        var blobClient = containerClient.GetBlobClient($"{fileType}/{file.FileName}");

        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, overwrite: true);
        }

        // Return the blob URI
        return Ok(new { blobUrl = blobClient.Uri.ToString() });
    }
}
