using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Newtonsoft.Json;
using TenderDraftApi.Models;
using System.Text;
using System.Text.RegularExpressions;

namespace TenderDraftApi.Services
{
    public class TemplateParserService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<TemplateParserService> _logger;
        private readonly HttpClient _httpClient;

        public TemplateParserService(IConfiguration configuration, ILogger<TemplateParserService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = new HttpClient();
        }

        public async Task<TemplateSchema?> ExtractSchemaFromDocx(string docxPath)
        {
            try
            {
                var templateText = ExtractTextFromDocx(docxPath);
                var prompt = BuildPrompt(templateText);
                
                var geminiResponse = await CallGeminiApi(prompt);
                var schema = CleanAndParseGeminiJson(geminiResponse);
                
                if (schema != null)
                {
                    _logger.LogInformation("✅ Extracted schema: {Schema}", JsonConvert.SerializeObject(schema, Formatting.Indented));
                }
                
                return schema;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting schema from DOCX");
                return null;
            }
        }

        private string ExtractTextFromDocx(string docxPath)
        {
            var paragraphs = new List<string>();
            
            using var doc = WordprocessingDocument.Open(docxPath, false);
            var body = doc.MainDocumentPart?.Document?.Body;
            
            if (body != null)
            {
                foreach (var paragraph in body.Elements<Paragraph>())
                {
                    var text = paragraph.InnerText?.Trim();
                    if (!string.IsNullOrEmpty(text))
                    {
                        paragraphs.Add(text);
                    }
                }
            }
            
            return string.Join("\n", paragraphs);
        }

        private string BuildPrompt(string templateText)
        {
            return $@"
You are a document template parser.

Your task is to convert any given pharmaceutical or tender-based document template into a JSON schema with:
- Field metadata (ID, label, type, generative)
- A templateString using {{placeholders}} where data goes

👀 Detect dynamic fields such as:
- Underlines (_________), placeholders ([Date], [Deviation 1])
- Table headers with repeating data (e.g., Brand Name, Generic Name, Pack Size)

If you see a table-like structure, define it as:
""type"": ""array of objects"" and include its ""itemSchema""

🎯 OUTPUT FORMAT:
{{
  ""name"": ""<Template Name>"",
  ""fields"": [...],
  ""templateString"": ""...""
}}

🎓 Field Types:
- string
- date
- array of objects

📌 Only return JSON. Do NOT wrap in ```json.

---

Document Template:

{templateText}

---
";
        }

        private async Task<string> CallGeminiApi(string prompt)
        {
            var apiKey = _configuration["GeminiSettings:ApiKey"];
            var modelName = _configuration["GeminiSettings:ModelName"];
            
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new InvalidOperationException("Gemini API key not configured");
            }

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey}";
            
            var response = await _httpClient.PostAsync(url, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Gemini API error: {response.StatusCode} - {responseContent}");
            }

            dynamic? result = JsonConvert.DeserializeObject(responseContent);
            return result?.candidates?[0]?.content?.parts?[0]?.text ?? "";
        }

        private TemplateSchema? CleanAndParseGeminiJson(string text)
        {
            try
            {
                var cleaned = Regex.Replace(text.Trim(), @"^```json\s*|\s*```$", "", RegexOptions.IgnoreCase);
                return JsonConvert.DeserializeObject<TemplateSchema>(cleaned);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to parse Gemini output: {Text}", text);
                return null;
            }
        }
    }
}