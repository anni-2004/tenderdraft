using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TenderDraftApi.Models;
using MongoDB.Bson;

namespace TenderDraftApi.Services
{
    public class MongoDbService
    {
        private readonly IMongoCollection<BsonDocument> _tendersCollection;
        private readonly ILogger<MongoDbService> _logger;

        public MongoDbService(IOptions<MongoDbSettings> mongoDbSettings, ILogger<MongoDbService> logger)
        {
            _logger = logger;
            
            try
            {
                var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
                var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
                _tendersCollection = mongoDatabase.GetCollection<BsonDocument>(mongoDbSettings.Value.TendersCollectionName);
                
                // Test connection
                mongoDatabase.RunCommand<BsonDocument>(new BsonDocument("ping", 1));
                _logger.LogInformation("✅ Connected to MongoDB successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to connect to MongoDB");
                throw;
            }
        }

        public async Task<Dictionary<string, object>?> GetTenderByIdAsync(string tenderId)
        {
            try
            {
                var filter = Builders<BsonDocument>.Filter.Eq("Tender ID", tenderId);
                var result = await _tendersCollection.Find(filter).FirstOrDefaultAsync();
                
                if (result == null)
                    return null;

                var dictionary = new Dictionary<string, object>();
                foreach (var element in result.Elements)
                {
                    if (element.Name != "_id")
                    {
                        dictionary[element.Name] = BsonTypeMapper.MapToDotNetValue(element.Value);
                    }
                }

                return dictionary;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tender by ID: {TenderId}", tenderId);
                throw;
            }
        }

        public async Task<TenderListResponse> GetTendersAsync(int limit, int skip)
        {
            try
            {
                var total = await _tendersCollection.CountDocumentsAsync(new BsonDocument());
                
                var results = await _tendersCollection
                    .Find(new BsonDocument())
                    .Skip(skip)
                    .Limit(limit)
                    .ToListAsync();

                var tenders = new List<Dictionary<string, object>>();
                
                foreach (var result in results)
                {
                    var dictionary = new Dictionary<string, object>();
                    foreach (var element in result.Elements)
                    {
                        if (element.Name != "_id")
                        {
                            dictionary[element.Name] = BsonTypeMapper.MapToDotNetValue(element.Value);
                        }
                    }
                    tenders.Add(dictionary);
                }

                return new TenderListResponse
                {
                    Total = (int)total,
                    Skip = skip,
                    Limit = limit,
                    Tenders = tenders
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing tenders");
                throw;
            }
        }
    }
}