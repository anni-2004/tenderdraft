import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Edit, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadTemplate, generateDocument, fetchTenderData } from '../services/api';

interface TemplateSchema {
  templateId: string;
  name: string;
  fields: Array<{
    id: string;
    label: string;
    type: string;
    generative?: boolean;
  }>;
  templateString: string;
}

interface TenderData {
  [key: string]: any;
}

const DraftGenerator: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'configure' | 'edit' | 'generate'>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Template upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [templateSchema, setTemplateSchema] = useState<TemplateSchema | null>(null);
  
  // Tender data state
  const [tenderId, setTenderId] = useState('');
  const [tenderData, setTenderData] = useState<TenderData | null>(null);
  const [mappedData, setMappedData] = useState<{ [key: string]: string }>({});
  
  // Editor state
  const [editorContent, setEditorContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.docx')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid .docx file');
    }
  };

  const handleUploadTemplate = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await uploadTemplate(selectedFile);
      setTemplateSchema({
        templateId: response.templateId,
        name: response.schema.name || 'Untitled Template',
        fields: response.schema.fields || [],
        templateString: response.schema.templateString || '',
      });
      setSuccess('Template uploaded successfully!');
      setStep('configure');
    } catch (err: any) {
      setError(err.message || 'Failed to upload template');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTenderData = async () => {
    if (!tenderId.trim()) {
      setError('Please enter a Tender ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchTenderData(tenderId);
      setTenderData(data);
      
      // Initialize mapped data with empty values
      const initialMappedData: { [key: string]: string } = {};
      templateSchema?.fields.forEach(field => {
        initialMappedData[field.id] = '';
      });
      setMappedData(initialMappedData);
      
      setSuccess('Tender data fetched successfully!');
      generatePreview(initialMappedData);
      setStep('edit');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tender data');
    } finally {
      setLoading(false);
    }
  };

  const generatePreview = (data: { [key: string]: string }) => {
    if (!templateSchema) return;
    
    let preview = templateSchema.templateString;
    
    // Replace placeholders with mapped data
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      preview = preview.replace(new RegExp(placeholder, 'g'), value || `<span class="unreplaced-field">{${key}}</span>`);
    });
    
    // Highlight remaining unreplaced fields
    preview = preview.replace(/\{([^}]+)\}/g, '<span class="unreplaced-field">{$1}</span>');
    
    setEditorContent(preview);
  };

  const handleFieldUpdate = (fieldId: string, value: string) => {
    const updatedMappedData = { ...mappedData, [fieldId]: value };
    setMappedData(updatedMappedData);
    generatePreview(updatedMappedData);
  };

  const handleGenerateDocument = async () => {
    if (!templateSchema) {
      setError('No template available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const blob = await generateDocument(templateSchema.templateId, mappedData);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${templateSchema.name}_Generated.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess('Document generated and downloaded successfully!');
      setStep('generate');
    } catch (err: any) {
      setError(err.message || 'Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setStep('upload');
    setSelectedFile(null);
    setTemplateSchema(null);
    setTenderId('');
    setTenderData(null);
    setMappedData({});
    setEditorContent('');
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Draft Generator</h1>
        <p className="text-gray-600">Create professional tender documents with AI-powered template processing</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { key: 'upload', label: 'Upload Template', icon: Upload },
            { key: 'configure', label: 'Configure Data', icon: FileText },
            { key: 'edit', label: 'Edit & Review', icon: Edit },
            { key: 'generate', label: 'Generate Document', icon: Download },
          ].map((stepItem, index) => (
            <div key={stepItem.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === stepItem.key 
                  ? 'bg-primary-600 border-primary-600 text-white' 
                  : index < ['upload', 'configure', 'edit', 'generate'].indexOf(step)
                    ? 'bg-success-600 border-success-600 text-white'
                    : 'border-gray-300 text-gray-400'
              }`}>
                <stepItem.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step === stepItem.key ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {stepItem.label}
              </span>
              {index < 3 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  index < ['upload', 'configure', 'edit', 'generate'].indexOf(step)
                    ? 'bg-success-600'
                    : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-error-600 flex-shrink-0" />
          <span className="text-error-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0" />
          <span className="text-success-700">{success}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'upload' && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Upload Template</h2>
                <p className="text-gray-600 mt-1">Select a .docx template file to get started</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template File (.docx)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx"
                    onChange={handleFileSelect}
                    className="input-field"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleUploadTemplate}
                  disabled={!selectedFile || loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload & Parse Template</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'configure' && templateSchema && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Configure Data Source</h2>
                <p className="text-gray-600 mt-1">Enter the Tender ID to fetch relevant data</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tender ID
                  </label>
                  <input
                    type="text"
                    value={tenderId}
                    onChange={(e) => setTenderId(e.target.value)}
                    placeholder="e.g., LEGACY11784"
                    className="input-field"
                  />
                </div>
                
                <button
                  onClick={handleFetchTenderData}
                  disabled={!tenderId.trim() || loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Fetching Data...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Fetch Tender Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'edit' && templateSchema && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Document</h2>
                  <p className="text-gray-600 mt-1">Review and edit the generated content</p>
                </div>
                
                <ReactQuill
                  theme="snow"
                  value={editorContent}
                  onChange={setEditorContent}
                  modules={quillModules}
                  className="mb-6"
                />
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleGenerateDocument}
                    disabled={loading}
                    className="btn-success flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Generate Document</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetProcess}
                    className="btn-secondary"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'generate' && (
            <div className="card text-center">
              <div className="py-12">
                <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Generated!</h2>
                <p className="text-gray-600 mb-6">Your document has been successfully generated and downloaded.</p>
                <button
                  onClick={resetProcess}
                  className="btn-primary"
                >
                  Generate Another Document
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {templateSchema && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Template Info</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900">{templateSchema.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Fields:</span>
                  <p className="text-gray-900">{templateSchema.fields.length} detected</p>
                </div>
              </div>
            </div>
          )}

          {step === 'edit' && templateSchema && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Field Mapping</h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {templateSchema.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={mappedData[field.id] || ''}
                      onChange={(e) => handleFieldUpdate(field.id, e.target.value)}
                      className="input-field text-sm"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tenderData && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Tender Data</h3>
              </div>
              <div className="text-sm text-gray-600">
                <p>Tender ID: <span className="font-medium text-gray-900">{tenderId}</span></p>
                <p>Fields Available: <span className="font-medium text-gray-900">{Object.keys(tenderData).length}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftGenerator;