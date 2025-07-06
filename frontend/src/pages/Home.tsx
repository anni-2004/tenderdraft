import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, Edit, Download, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Template',
      description: 'Upload your .docx template and let AI extract the schema automatically',
    },
    {
      icon: FileText,
      title: 'Smart Mapping',
      description: 'AI maps your tender data to template fields using advanced embeddings',
    },
    {
      icon: Edit,
      title: 'Rich Editor',
      description: 'Edit and refine your document with our powerful rich text editor',
    },
    {
      icon: Download,
      title: 'Generate Document',
      description: 'Download your final document as a professional .docx file',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Tender Draft
          <span className="text-primary-600"> Generator</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Streamline your tender document creation with AI-powered template processing. 
          Upload templates, map data intelligently, and generate professional documents in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/draft-generator"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/dashboard"
            className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-3"
          >
            <span>View Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card text-center hover:shadow-lg transition-shadow duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
              <feature.icon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-primary-50 rounded-2xl p-8 mb-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">10x</div>
            <div className="text-gray-600">Faster Processing</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Templates Processed</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload & Parse</h3>
            <p className="text-gray-600">Upload your template and let AI extract the structure</p>
          </div>
          <div className="relative">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Map & Edit</h3>
            <p className="text-gray-600">Review AI mappings and edit content as needed</p>
          </div>
          <div className="relative">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate & Download</h3>
            <p className="text-gray-600">Create your final document and download instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;