# TenderDraft - AI-Powered Document Generator

A full-stack application for generating tender documents using AI-powered template processing with FastAPI backend and React frontend.

## 🚀 Features

- **Smart Template Processing**: Upload .docx templates and let AI extract the schema automatically
- **Intelligent Field Mapping**: AI maps tender data to template fields using advanced embeddings
- **Rich Text Editor**: Edit and refine documents with a powerful WYSIWYG editor
- **Professional Output**: Generate and download final documents as .docx files
- **Real-time Preview**: See changes instantly as you edit field mappings
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Google Gemini AI**: For intelligent template parsing and schema extraction
- **MongoDB**: Document database for storing tender data
- **Python-docx**: For document processing and generation
- **Sentence Transformers**: For semantic field mapping

### Frontend
- **React 18**: Modern React with hooks and TypeScript
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Quill**: Rich text editor component
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Backend Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_KEY=your_gemini_api_key_here
   ```

3. **Start the FastAPI server**:
   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be available at `http://localhost:8000`

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
- `POST /docgen/upload-template/` - Upload and parse template
- `POST /docgen/generate-document/` - Generate final document

### Data Fetching
- `GET /tender/{id}` - Fetch tender data by ID (to be implemented)

## 🏗️ Project Structure

```
tenderdraft1/
├── backend/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── config.py              # Configuration and environment variables
│   ├── routes/
│   │   ├── __init__.py
│   │   └── docgen.py          # Document generation routes
│   └── services/
│       ├── __init__.py
│       ├── template_parser.py  # AI-powered template parsing
│       ├── field_mapper.py     # Semantic field mapping
│       ├── doc_generator.py    # Document generation logic
│       └── schema.py          # Schema management
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

## 🔒 Security Considerations

- API keys are stored in environment variables
- CORS is configured for development (update for production)
- File uploads are validated for .docx format
- Input sanitization is implemented for user data

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Install dependencies: `pip install -r requirements.txt`
3. Run with: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your static hosting service
3. Update API base URL for production environment

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
- Check the documentation in the `/docs` folder
- Review the API documentation at `http://localhost:8000/docs` when running locally

## 🔮 Future Enhancements

- [ ] Multi-language template support
- [ ] Batch document processing
- [ ] Template versioning system
- [ ] Advanced field validation
- [ ] Integration with more document formats
- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting