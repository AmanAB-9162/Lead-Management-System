import { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Plus, Search, Filter, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LeadsList = () => {
  const { user, isAuthenticated } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    is_qualified: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const columnDefs = [
    {
      field: 'first_name',
      headerName: 'First Name',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      field: 'email',
      headerName: 'Email',
      sortable: true,
      filter: true,
      width: 200
    },
    {
      field: 'company',
      headerName: 'Company',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      field: 'phone',
      headerName: 'Phone',
      sortable: true,
      filter: true,
      width: 140
    },
    {
      field: 'city',
      headerName: 'City',
      sortable: true,
      filter: true,
      width: 120
    },
    {
      field: 'state',
      headerName: 'State',
      sortable: true,
      filter: true,
      width: 80
    },
    {
      field: 'source',
      headerName: 'Source',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params) => {
        const sourceColors = {
          website: 'bg-blue-100 text-blue-800',
          facebook_ads: 'bg-purple-100 text-purple-800',
          google_ads: 'bg-green-100 text-green-800',
          referral: 'bg-yellow-100 text-yellow-800',
          events: 'bg-pink-100 text-pink-800',
          other: 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceColors[params.value] || 'bg-gray-100 text-gray-800'}`}>
            {params.value?.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params) => {
        const statusColors = {
          new: 'bg-gray-100 text-gray-800',
          contacted: 'bg-blue-100 text-blue-800',
          qualified: 'bg-green-100 text-green-800',
          lost: 'bg-red-100 text-red-800',
          won: 'bg-emerald-100 text-emerald-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[params.value] || 'bg-gray-100 text-gray-800'}`}>
            {params.value}
          </span>
        );
      }
    },
    {
      field: 'score',
      headerName: 'Score',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 80
    },
    {
      field: 'lead_value',
      headerName: 'Value',
      sortable: true,
      filter: 'agNumberColumnFilter',
      width: 100,
      cellRenderer: (params) => `$${params.value?.toLocaleString()}`
    },
    {
      field: 'is_qualified',
      headerName: 'Qualified',
      sortable: true,
      filter: true,
      width: 100,
      cellRenderer: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${params.value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {params.value ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      field: 'created_at',
      headerName: 'Created',
      sortable: true,
      filter: 'agDateColumnFilter',
      width: 120,
      cellRenderer: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      headerName: 'Actions',
      width: 140,
      cellRenderer: (params) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/leads/${params.data._id}/edit`)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            title="Edit lead"
          >
            <Edit className="h-3 w-3" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDelete(params.data._id)}
            className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
            title="Delete lead"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete</span>
          </button>
        </div>
      )
    }
  ];

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      console.log('Fetching leads with params:', params.toString());
      console.log('API URL:', `/api/leads?${params}`);
      
      const response = await axios.get(`/api/leads?${params}`);
      
      console.log('✅ API Response received:', response.status);
      console.log('✅ Response data:', response.data);
      console.log('✅ Leads array:', response.data.data);
      console.log('✅ Leads count:', response.data.data?.length);
      console.log('✅ Pagination:', response.data.pagination);
      console.log('✅ Total in pagination:', response.data.pagination?.total);
      
      if (response.data.success) {
        console.log('✅ Setting leads state with:', response.data.data?.length, 'leads');
        console.log('✅ Setting pagination:', response.data.pagination);
        setLeads(response.data.data || []);
        setPagination(response.data.pagination || {});
      } else {
        console.log('❌ API returned success: false');
        setLeads([]);
      }
    } catch (error) {
      console.error('Error fetching leads - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      toast.error('Failed to fetch leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    } else {
      console.log('User not authenticated, skipping leads fetch');
    }
  }, [fetchLeads, isAuthenticated]);

  // Debug leads state changes
  useEffect(() => {
    console.log('🔄 Leads state updated:', leads.length, 'leads');
    console.log('🔄 Pagination state:', pagination);
  }, [leads, pagination]);

  const handleDelete = async (leadId) => {
    const leadToDelete = leads.find(lead => lead._id === leadId);
    const leadName = leadToDelete ? `${leadToDelete.first_name} ${leadToDelete.last_name}` : 'this lead';
    
    if (window.confirm(`Are you sure you want to delete ${leadName}? This action cannot be undone.`)) {
      try {
        console.log('🗑️ Deleting lead:', leadId);
        
        const response = await axios.delete(`/api/leads/${leadId}`);
        
        if (response.data.success) {
          console.log('✅ Lead deleted successfully');
          toast.success(`Lead "${leadName}" deleted successfully`);
          fetchLeads(); // Refresh the leads list
        } else {
          throw new Error(response.data.message || 'Delete failed');
        }
      } catch (error) {
        console.error('❌ Error deleting lead:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete lead';
        toast.error(errorMessage);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRefresh = () => {
    fetchLeads();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('/leads/new')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search leads..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
                <option value="won">Won</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="input-field"
              >
                <option value="">All Sources</option>
                <option value="website">Website</option>
                <option value="facebook_ads">Facebook Ads</option>
                <option value="google_ads">Google Ads</option>
                <option value="referral">Referral</option>
                <option value="events">Events</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualified
              </label>
              <select
                value={filters.is_qualified}
                onChange={(e) => handleFilterChange('is_qualified', e.target.value)}
                className="input-field"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Leads Grid */}
      <div className="card">
        <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={leads}
            pagination={true}
            paginationPageSize={pagination.limit}
            paginationPageSizeSelector={[10, 20, 50]}
            onPaginationChanged={(event) => {
              const newPage = event.api.paginationGetCurrentPage() + 1;
              if (newPage !== pagination.page) {
                handlePageChange(newPage);
              }
            }}
            loading={loading}
            suppressRowClickSelection={true}
            rowSelection="single"
          />
        </div>
        

        {/* Simple Table Fallback */}
        {leads.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Simple Table View (Fallback)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Company</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Source</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 10).map((lead) => (
                    <tr key={lead._id} className="border-t">
                      <td className="px-4 py-2">{lead.first_name}</td>
                      <td className="px-4 py-2">{lead.last_name}</td>
                      <td className="px-4 py-2">{lead.email}</td>
                      <td className="px-4 py-2">{lead.company}</td>
                      <td className="px-4 py-2">{lead.phone}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          lead.status === 'new' ? 'bg-gray-100 text-gray-800' :
                          lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                          lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          lead.source === 'website' ? 'bg-blue-100 text-blue-800' :
                          lead.source === 'facebook_ads' ? 'bg-purple-100 text-purple-800' :
                          lead.source === 'google_ads' ? 'bg-green-100 text-green-800' :
                          lead.source === 'referral' ? 'bg-yellow-100 text-yellow-800' :
                          lead.source === 'events' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.source?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/leads/${lead._id}/edit`)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit lead"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete lead"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {leads.length > 10 && (
              <p className="mt-2 text-sm text-gray-600">
                Showing first 10 of {leads.length} leads
              </p>
            )}
          </div>
        )}

        {/* Pagination Info */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
          <div>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsList;
