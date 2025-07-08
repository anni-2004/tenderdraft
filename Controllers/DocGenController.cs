using Microsoft.AspNetCore.Mvc;
using TenderDraftApi.Models;
using TenderDraftApi.Services;

namespace TenderDraftApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocGenController : ControllerBase
    {
        private readonly TemplateParserService _templateParser;
        private readonly DocumentGeneratorService _documentGenerator;
        private readonly ILogger<DocGenController> _logger;

        public DocGenController(
            TemplateParserService templateParser,
            DocumentGeneratorService documentGenerator,
            ILogger<DocGenController> logger)
        {
            _templateParser = templateParser;
            _documentGenerator = documentGenerator;
            _logger = logger;
        }

        [HttpPost("upload-template")]
        public async Task<IActionResult> UploadTemplate(IFormFile file)
        {
            try
            {
                if (file == null || !file.FileName.EndsWith(".docx"))
                {
                    return BadRequest(new { error = "Only .docx files allowed" });
                }

                var templateId = Guid.NewGuid().ToString();
                var templatePath = await SaveTemplateFile(file, templateId);
                
                var schema = await _templateParser.ExtractSchemaFromDocx(templatePath);
                
                if (schema == null)
                {
                    return StatusCode(500, new { error = "Failed to parse schema from template." });
                }

                var response = new TemplateUploadResponse
                {
                    TemplateId = templateId,
                    Schema = schema
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading template");
                return StatusCode(500, new { error = $"Template upload failed: {ex.Message}" });
            }
        }

        [HttpPost("generate-document")]
        public async Task<IActionResult> GenerateDocument([FromForm] string templateId, [FromForm] string mappedData)
        {
            try
            {
                var mappedDataDict = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string>>(mappedData);
                if (mappedDataDict == null)
                {
                    return BadRequest(new { error = "Invalid mapped data format" });
                }

                var templatePath = Path.Combine("storage", "templates", $"{templateId}.docx");
                if (!System.IO.File.Exists(templatePath))
                {
                    return NotFound(new { error = "Template not found" });
                }

                var schema = await _templateParser.ExtractSchemaFromDocx(templatePath);
                if (schema == null)
                {
                    return StatusCode(500, new { error = "Failed to parse template schema" });
                }

                var outputPath = Path.Combine("storage", "output", $"{templateId}_final.docx");
                await _documentGenerator.GenerateDocxFromTemplate(schema.TemplateString, mappedDataDict, outputPath);

                var fileBytes = await System.IO.File.ReadAllBytesAsync(outputPath);
                return File(fileBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Generated_Document.docx");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating document");
                return StatusCode(500, new { error = $"Document generation failed: {ex.Message}" });
            }
        }

        private async Task<string> SaveTemplateFile(IFormFile file, string templateId)
        {
            var templatesDir = Path.Combine("storage", "templates");
            Directory.CreateDirectory(templatesDir);

            var filePath = Path.Combine(templatesDir, $"{templateId}.docx");
            
            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
            
            return filePath;
        }
    }
}