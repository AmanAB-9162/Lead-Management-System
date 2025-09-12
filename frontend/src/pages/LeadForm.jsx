import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LeadForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      city: '',
      state: '',
      source: 'website',
      status: 'new',
      score: 0,
      lead_value: 0,
      is_qualified: false
    }
  });

  useEffect(() => {
    if (isEdit) {
      fetchLead();
    }
  }, [id, isEdit]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      console.log('📥 Fetching lead with ID:', id);
      
      const response = await axios.get(`/api/leads/${id}`);
      
      if (response.data.success) {
        const lead = response.data.data;
        console.log('✅ Lead fetched successfully:', lead);
        
        Object.keys(lead).forEach(key => {
          if (key !== '_id' && key !== 'created_at' && key !== 'updated_at' && key !== 'created_by') {
            setValue(key, lead[key]);
          }
        });
        
        console.log('✅ Form populated with lead data');
      } else {
        throw new Error(response.data.message || 'Failed to fetch lead');
      }
    } catch (error) {
      console.error('❌ Error fetching lead:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch lead';
      toast.error(errorMessage);
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log('💾 Saving lead data:', data);
      
      if (isEdit) {
        console.log('🔄 Updating lead with ID:', id);
        const response = await axios.put(`/api/leads/${id}`, data);
        
        if (response.data.success) {
          console.log('✅ Lead updated successfully');
          toast.success('Lead updated successfully');
        } else {
          throw new Error(response.data.message || 'Update failed');
        }
      } else {
        console.log('➕ Creating new lead');
        const response = await axios.post('/api/leads', data);
        
        if (response.data.success) {
          console.log('✅ Lead created successfully');
          toast.success('Lead created successfully');
        } else {
          throw new Error(response.data.message || 'Creation failed');
        }
      }
      
      navigate('/leads');
    } catch (error) {
      console.error('❌ Error saving lead:', error);
      const message = error.response?.data?.message || 'Failed to save lead';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Leads</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Lead' : 'Create New Lead'}
        </h1>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  {...register('first_name', { required: 'First name is required' })}
                  className="input-field"
                  placeholder="Enter first name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  {...register('last_name', { required: 'Last name is required' })}
                  className="input-field"
                  placeholder="Enter last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  {...register('company')}
                  className="input-field"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  {...register('city')}
                  className="input-field"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  {...register('state')}
                  className="input-field"
                  placeholder="Enter state"
                />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Lead Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source *
                </label>
                <select
                  {...register('source', { required: 'Source is required' })}
                  className="input-field"
                >
                  <option value="website">Website</option>
                  <option value="facebook_ads">Facebook Ads</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="referral">Referral</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
                {errors.source && (
                  <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="input-field"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register('score', { 
                    min: { value: 0, message: 'Score must be at least 0' },
                    max: { value: 100, message: 'Score must be at most 100' }
                  })}
                  className="input-field"
                  placeholder="Enter score"
                />
                {errors.score && (
                  <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Value ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('lead_value', { 
                    min: { value: 0, message: 'Lead value must be at least 0' }
                  })}
                  className="input-field"
                  placeholder="Enter lead value"
                />
                {errors.lead_value && (
                  <p className="mt-1 text-sm text-red-600">{errors.lead_value.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('is_qualified')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Is Qualified
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : (isEdit ? 'Update Lead' : 'Create Lead')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
