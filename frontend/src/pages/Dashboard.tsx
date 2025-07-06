import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalDocuments: number;
  pendingDocuments: number;
  completedDocuments: number;
  errorDocuments: number;
}

interface RecentActivity {
  id: string;
  templateName: string;
  tenderId: string;
  status: 'completed' | 'pending' | 'error';
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    pendingDocuments: 0,
    completedDocuments: 0,
    errorDocuments: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalDocuments: 156,
        pendingDocuments: 8,
        completedDocuments: 142,
        errorDocuments: 6,
      });

      setRecentActivity([
        {
          id: '1',
          templateName: 'EMD Refund Request',
          tenderId: 'LEGACY11784',
          status: 'completed',
          timestamp: '2 hours ago',
        },
        {
          id: '2',
          templateName: 'Tender Submission Form',
          tenderId: 'LEGACY11785',
          status: 'pending',
          timestamp: '4 hours ago',
        },
        {
          id: '3',
          templateName: 'Compliance Certificate',
          tenderId: 'LEGACY11786',
          status: 'completed',
          timestamp: '1 day ago',
        },
        {
          id: '4',
          templateName: 'Technical Specification',
          tenderId: 'LEGACY11787',
          status: 'error',
          timestamp: '2 days ago',
        },
      ]);
      
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-error-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-badge status-success';
      case 'pending':
        return 'status-badge status-warning';
      case 'error':
        return 'status-badge status-error';
      default:
        return 'status-badge';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor your document generation activity and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedDocuments}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+8% from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingDocuments}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>Currently processing</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.errorDocuments}</p>
            </div>
            <div className="p-3 bg-error-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-error-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-error-600">
            <span>Requires attention</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                {getStatusIcon(activity.status)}
                <div>
                  <p className="font-medium text-gray-900">{activity.templateName}</p>
                  <p className="text-sm text-gray-600">Tender ID: {activity.tenderId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={getStatusBadge(activity.status)}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;