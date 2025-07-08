namespace TenderDraftApi.Models
{
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string TendersCollectionName { get; set; } = string.Empty;
    }
}