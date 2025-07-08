using System.Text.Json;

namespace TenderDraftApi.Services
{
    public class FieldMapperService
    {
        private readonly ILogger<FieldMapperService> _logger;

        public FieldMapperService(ILogger<FieldMapperService> logger)
        {
            _logger = logger;
        }

        public Dictionary<string, string> MapFieldsByEmbedding(
            List<Models.TemplateField> geminiFields, 
            List<string> backendFields, 
            Dictionary<string, object> backendData, 
            float threshold = 0.5f)
        {
            var mappedData = new Dictionary<string, string>();

            // Simple string similarity mapping (placeholder for embedding-based mapping)
            foreach (var field in geminiFields)
            {
                var fieldId = field.Id;
                var label = !string.IsNullOrEmpty(field.Label) ? field.Label : fieldId;

                // Find best match using simple string similarity
                var bestMatch = FindBestMatch(label, backendFields, threshold);
                
                if (bestMatch != null && backendData.ContainsKey(bestMatch))
                {
                    mappedData[fieldId] = backendData[bestMatch]?.ToString() ?? "";
                    _logger.LogInformation("✅ {Label} -> {BestMatch}", label, bestMatch);
                }
                else
                {
                    mappedData[fieldId] = "";
                    _logger.LogWarning("⚠️ No good match for {Label}", label);
                }
            }

            return mappedData;
        }

        private string? FindBestMatch(string query, List<string> candidates, float threshold)
        {
            var queryLower = query.ToLower();
            var bestMatch = "";
            var bestScore = 0.0;

            foreach (var candidate in candidates)
            {
                var candidateLower = candidate.ToLower();
                var score = CalculateSimilarity(queryLower, candidateLower);
                
                if (score > bestScore && score >= threshold)
                {
                    bestScore = score;
                    bestMatch = candidate;
                }
            }

            return bestScore >= threshold ? bestMatch : null;
        }

        private double CalculateSimilarity(string s1, string s2)
        {
            // Simple Jaccard similarity
            var set1 = s1.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToHashSet();
            var set2 = s2.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToHashSet();
            
            var intersection = set1.Intersect(set2).Count();
            var union = set1.Union(set2).Count();
            
            return union == 0 ? 0 : (double)intersection / union;
        }
    }
}