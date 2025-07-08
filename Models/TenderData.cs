using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace TenderDraftApi.Models
{
    public class TenderData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }

        [BsonElement("Tender ID")]
        [JsonProperty("Tender ID")]
        public string TenderId { get; set; } = string.Empty;

        [BsonExtraElements]
        public Dictionary<string, object> AdditionalFields { get; set; } = new();
    }

    public class TenderListResponse
    {
        public int Total { get; set; }
        public int Skip { get; set; }
        public int Limit { get; set; }
        public List<Dictionary<string, object>> Tenders { get; set; } = new();
    }

    public class TenderFieldsResponse
    {
        public string TenderId { get; set; } = string.Empty;
        public int TotalFields { get; set; }
        public Dictionary<string, FieldInfo> Fields { get; set; } = new();
    }

    public class FieldInfo
    {
        public string Type { get; set; } = string.Empty;
        public string? SampleValue { get; set; }
    }
}