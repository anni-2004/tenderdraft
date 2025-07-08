# TenderDraft - AI-Powered Document Generator (.NET Backend)

A full-stack application for generating tender documents using AI-powered template processing with .NET Core Web API backend and React frontend.

## 🚀 Features

- **Smart Template Processing**: Upload .docx templates and let AI extract the schema automatically
- **Intelligent Field Mapping**: AI maps tender data to template fields using advanced algorithms
- **Rich Text Editor**: Edit and refine documents with a powerful WYSIWYG editor
- **Professional Output**: Generate and download final documents as .docx files
- **Real-time Preview**: See changes instantly as you edit field mappings
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

### Backend (.NET Core)
- **.NET 8.0**: Modern, cross-platform framework
- **ASP.NET Core Web API**: RESTful API development
- **MongoDB.Driver**: MongoDB integration for data storage
- **DocumentFormat.OpenXml**: For .docx document processing
- **Google Gemini AI**: For intelligent template parsing and schema extraction
- **Swagger/OpenAPI**: API documentation

### Frontend (React)
- **React 18**: Modern React with hooks and TypeScript
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Quill**: Rich text editor component
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server

## 📦 Installation & Setup

### Prerequisites
- .NET 8.0 SDK
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Backend Setup (.NET)

1. **Restore .NET packages**:
   ```bash
   dotnet restore
   ```

2. **Configuration**:
   Update `appsettings.json` with your settings:
   ```json
   {
     "MongoDbSettings": {
       "ConnectionString": "your_mongodb_connection_string",
       "DatabaseName": "tender_system",
       "TendersCollectionName": "tenders"
     },
     "GeminiSettings": {
       "ApiKey": "your_gemini_api_key",
       "ModelName": "gemini-2.0-flash-lite"
     }
   }
   ```

3. **Run the .NET API**:
   ```bash
   dotnet run
   ```

   The backend will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/swagger`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 🎯 Usage

### 1. Upload Template
- Navigate to `/draft-generator`
- Upload a `.docx` template file
- AI will automatically extract the schema and identify fields

### 2. Configure Data Source
- Enter a Tender ID to fetch relevant data from the database
- The system will attempt to map fields automatically

### 3. Edit & Review
- Use the rich text editor to review and modify the generated content
- Update field mappings in the sidebar as needed
- Unreplaced fields are highlighted for easy identification

### 4. Generate Document
- Click "Generate Document" to create the final .docx file
- The document will be automatically downloaded

## 🔧 API Endpoints

### Template Management
- `POST /api/docgen/upload-template` - Upload and parse template
- `POST /api/docgen/generate-document` - Generate final document

### Tender Data Management
- `GET /api/tender/{tenderId}` - Fetch tender data by ID
- `GET /api/tenders` - List all tenders with pagination
- `GET /api/tender/{tenderId}/fields` - Get available fields for a tender

### Health & Info
- `GET /` - API information and available endpoints
- `GET /health` - Health check endpoint

## 🏗️ Project Structure

```
TenderDraftApi/
├── Controllers/
│   ├── DocGenController.cs      # Document generation endpoints
│   └── TenderController.cs      # Tender data endpoints
├── Models/
│   ├── MongoDbSettings.cs       # MongoDB configuration
│   ├── GeminiSettings.cs        # Gemini AI configuration
│   ├── TemplateSchema.cs        # Template schema models
│   └── TenderData.cs           # Tender data models
├── Services/
│   ├── MongoDbService.cs        # MongoDB operations
│   ├── TemplateParserService.cs # AI-powered template parsing
│   ├── DocumentGeneratorService.cs # Document generation
│   └── FieldMapperService.cs    # Field mapping logic
├── storage/
│   ├── templates/              # Uploaded template files
│   └── output/                 # Generated documents
├── frontend/                   # React frontend application
├── Program.cs                  # Application entry point
├── appsettings.json           # Configuration
└── TenderDraftApi.csproj      # Project file
```

## 🔒 Security Considerations

- API keys are stored in configuration files (use Azure Key Vault for production)
- CORS is configured for development (update for production)
- File uploads are validated for .docx format
- Input sanitization is implemented for user data

## 🚀 Deployment

### Backend Deployment
1. **Build the application**:
   ```bash
   dotnet publish -c Release -o ./publish
   ```

2. **Deploy to your hosting platform** (Azure App Service, AWS, etc.)
3. **Update configuration** for production environment
4. **Set up environment variables** for sensitive data

### Frontend Deployment
1. **Build the application**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `dist` folder** to your static hosting service
3. **Update API base URL** for production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `http://localhost:8000/swagger` when running locally
- Review the .NET and React documentation

## 🔮 Future Enhancements

- [ ] Multi-language template support
- [ ] Batch document processing
- [ ] Template versioning system
- [ ] Advanced field validation
- [ ] Integration with more document formats
- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Azure/AWS cloud integration
- [ ] Docker containerization