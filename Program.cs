using Microsoft.AspNetCore.Cors;
using TenderDraftApi.Services;
using TenderDraftApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure MongoDB
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// Register services
builder.Services.AddSingleton<MongoDbService>();
builder.Services.AddScoped<TemplateParserService>();
builder.Services.AddScoped<DocumentGeneratorService>();
builder.Services.AddScoped<FieldMapperService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// Root endpoint
app.MapGet("/", () => new
{
    message = "TenderDraft API is running!",
    version = "1.0.0",
    docs = "/swagger",
    endpoints = new
    {
        upload_template = "/api/docgen/upload-template",
        generate_document = "/api/docgen/generate-document",
        get_tender = "/api/tender/{tenderId}",
        list_tenders = "/api/tenders"
    }
});

app.MapGet("/health", () => new { status = "healthy", service = "TenderDraft API" });

app.Run();