using Microsoft.AspNetCore.Mvc;
using TenderDraftApi.Models;
using TenderDraftApi.Services;

namespace TenderDraftApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class TenderController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly ILogger<TenderController> _logger;

        public TenderController(MongoDbService mongoDbService, ILogger<TenderController> logger)
        {
            _mongoDbService = mongoDbService;
            _logger = logger;
        }

        [HttpGet("tender/{tenderId}")]
        public async Task<IActionResult> GetTenderData(string tenderId)
        {
            try
            {
                var tenderData = await _mongoDbService.GetTenderByIdAsync(tenderId);
                
                if (tenderData == null)
                {
                    return NotFound(new { detail = $"Tender with ID '{tenderId}' not found" });
                }

                return Ok(tenderData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching tender data for ID: {TenderId}", tenderId);
                return StatusCode(500, new { detail = $"Failed to fetch tender data: {ex.Message}" });
            }
        }

        [HttpGet("tenders")]
        public async Task<IActionResult> ListTenders([FromQuery] int limit = 10, [FromQuery] int skip = 0)
        {
            try
            {
                var result = await _mongoDbService.GetTendersAsync(limit, skip);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing tenders");
                return StatusCode(500, new { detail = $"Failed to fetch tenders: {ex.Message}" });
            }
        }

        [HttpGet("tender/{tenderId}/fields")]
        public async Task<IActionResult> GetTenderFields(string tenderId)
        {
            try
            {
                var tenderData = await _mongoDbService.GetTenderByIdAsync(tenderId);
                
                if (tenderData == null)
                {
                    return NotFound(new { detail = $"Tender with ID '{tenderId}' not found" });
                }

                var fields = new Dictionary<string, FieldInfo>();
                
                foreach (var kvp in tenderData)
                {
                    if (kvp.Key != "_id")
                    {
                        fields[kvp.Key] = new FieldInfo
                        {
                            Type = kvp.Value?.GetType().Name ?? "null",
                            SampleValue = kvp.Value?.ToString()?.Length > 100 
                                ? kvp.Value.ToString()![..100] 
                                : kvp.Value?.ToString()
                        };
                    }
                }

                var response = new TenderFieldsResponse
                {
                    TenderId = tenderId,
                    TotalFields = fields.Count,
                    Fields = fields
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching tender fields for ID: {TenderId}", tenderId);
                return StatusCode(500, new { detail = $"Failed to fetch tender fields: {ex.Message}" });
            }
        }
    }
}