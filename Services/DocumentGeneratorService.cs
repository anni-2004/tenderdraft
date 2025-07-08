using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text.RegularExpressions;

namespace TenderDraftApi.Services
{
    public class DocumentGeneratorService
    {
        private readonly ILogger<DocumentGeneratorService> _logger;

        public DocumentGeneratorService(ILogger<DocumentGeneratorService> logger)
        {
            _logger = logger;
        }

        public async Task GenerateDocxFromTemplate(string templateString, Dictionary<string, string> mappedData, string outputPath)
        {
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(outputPath)!);

                // Normalize curly quotes and braces
                templateString = Regex.Replace(templateString, @"[""]", "\"");
                templateString = Regex.Replace(templateString, @"['']", "'");

                _logger.LogInformation("📄 Original Template: {Template}", templateString);
                _logger.LogInformation("🔑 Mapped Data:");
                foreach (var kvp in mappedData)
                {
                    _logger.LogInformation("  {Key}: {Value}", kvp.Key, kvp.Value);
                }

                // Replace placeholders with values
                var filledText = templateString;
                foreach (var kvp in mappedData)
                {
                    var placeholder = $"{{{kvp.Key}}}";
                    var value = !string.IsNullOrEmpty(kvp.Value) ? kvp.Value : "";
                    filledText = filledText.Replace(placeholder, value);
                }

                // Clean unreplaced placeholders
                var unreplaced = Regex.Matches(filledText, @"\{([^}]+)\}").Cast<Match>().Select(m => m.Groups[1].Value).ToList();
                if (unreplaced.Any())
                {
                    _logger.LogWarning("⚠️ Unreplaced placeholders found: {Unreplaced}", string.Join(", ", unreplaced));
                }
                filledText = Regex.Replace(filledText, @"\{[^}]+\}", "");

                // Create DOCX document
                using var doc = WordprocessingDocument.Create(outputPath, WordprocessingDocumentType.Document);
                var mainPart = doc.AddMainDocumentPart();
                mainPart.Document = new Document();
                var body = mainPart.Document.AppendChild(new Body());

                // Add content to document
                var lines = filledText.Split('\n');
                foreach (var line in lines)
                {
                    if (string.IsNullOrWhiteSpace(line))
                        continue;

                    var paragraph = new Paragraph();
                    var run = new Run();
                    var text = new Text(line.Trim());
                    
                    // Make uppercase lines bold
                    if (line.Trim().ToUpper() == line.Trim() && line.Trim().Length > 0)
                    {
                        run.RunProperties = new RunProperties(new Bold());
                    }
                    
                    run.Append(text);
                    paragraph.Append(run);
                    body.Append(paragraph);
                }

                _logger.LogInformation("✅ Document generated at: {OutputPath}", outputPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating document");
                throw;
            }
        }
    }
}