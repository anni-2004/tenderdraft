using Newtonsoft.Json;

namespace TenderDraftApi.Models
{
    public class TemplateSchema
    {
        [JsonProperty("name")]
        public string Name { get; set; } = string.Empty;

        [JsonProperty("fields")]
        public List<TemplateField> Fields { get; set; } = new();

        [JsonProperty("templateString")]
        public string TemplateString { get; set; } = string.Empty;
    }

    public class TemplateField
    {
        [JsonProperty("id")]
        public string Id { get; set; } = string.Empty;

        [JsonProperty("label")]
        public string Label { get; set; } = string.Empty;

        [JsonProperty("type")]
        public string Type { get; set; } = string.Empty;

        [JsonProperty("generative")]
        public bool? Generative { get; set; }
    }

    public class TemplateUploadResponse
    {
        public string TemplateId { get; set; } = string.Empty;
        public TemplateSchema Schema { get; set; } = new();
    }
}