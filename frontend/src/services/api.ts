import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.detail || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export interface TemplateUploadResponse {
  templateId: string;
  schema: {
    name: string;
    fields: Array<{
      id: string;
      label: string;
      type: string;
      generative?: boolean;
    }>;
    templateString: string;
  };
}

export interface TenderData {
  [key: string]: any;
}

export const uploadTemplate = async (file: File): Promise<TemplateUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/docgen/upload-template/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const fetchTenderData = async (tenderId: string): Promise<TenderData> => {
  try {
    const response = await api.get(`/api/tender/${tenderId}`);
    return response.data;
  } catch (error: any) {
    // If the API endpoint is not available, return mock data
    if (error.message.includes('404') || error.message.includes('No response from server')) {
      console.log(`Using mock data for tender ID: ${tenderId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock tender data
      const mockData: TenderData = {
        'Tender ID': tenderId,
        'Company Name': 'AZPIL Pharmaceuticals Ltd.',
        'Tender Title': 'Supply of Essential Medicines',
        'EMD Amount': '₹50,000',
        'Tender Date': '2024-01-15',
        'Submission Deadline': '2024-02-15',
        'Contact Person': 'Dr. Rajesh Kumar',
        'Phone': '+91-9876543210',
        'Email': 'rajesh.kumar@azpil.com',
        'Address': '123 Industrial Area, Mumbai, Maharashtra 400001',
        'Bank Name': 'State Bank of India',
        'Account Number': '1234567890',
        'IFSC Code': 'SBIN0001234',
        'Registration Number': 'REG/2024/001',
        'GST Number': '27ABCDE1234F1Z5',
        'PAN Number': 'ABCDE1234F',
      };
      
      return mockData;
    }
    
    throw error;
  }
};

export const generateDocument = async (
  templateId: string, 
  mappedData: { [key: string]: string }
): Promise<Blob> => {
  const formData = new FormData();
  formData.append('templateId', templateId);
  formData.append('mappedData', JSON.stringify(mappedData));

  const response = await api.post('/docgen/generate-document/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
  });

  return response.data;
};

export const listTenders = async (limit: number = 10, skip: number = 0) => {
  const response = await api.get(`/api/tenders/?limit=${limit}&skip=${skip}`);
  return response.data;
};

export default api;