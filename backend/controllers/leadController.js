const Lead = require('../models/Lead');

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      created_by: req.user.id
    };

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all leads with pagination and filtering
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Build filter object - Show ALL leads by default
    let filter = {};
    
    // Show ALL leads without any filtering
    console.log('🔍 User ID from token:', req.user?.id);
    console.log('🔍 Showing ALL leads without filtering');
    
    // Remove all filtering to show all leads
    filter = {};

    // String field filters (contains)
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: 'i' };
    }
    if (req.query.company) {
      filter.company = { $regex: req.query.company, $options: 'i' };
    }
    if (req.query.city) {
      filter.city = { $regex: req.query.city, $options: 'i' };
    }

    // Enum field filters (equals)
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.source) {
      filter.source = req.query.source;
    }

    // Number field filters
    if (req.query.score) {
      const scoreFilter = {};
      if (req.query.score_operator === 'gt') {
        scoreFilter.$gt = parseInt(req.query.score);
      } else if (req.query.score_operator === 'lt') {
        scoreFilter.$lt = parseInt(req.query.score);
      } else if (req.query.score_operator === 'between') {
        const [min, max] = req.query.score.split(',').map(Number);
        scoreFilter.$gte = min;
        scoreFilter.$lte = max;
      } else {
        scoreFilter.$eq = parseInt(req.query.score);
      }
      filter.score = scoreFilter;
    }

    if (req.query.lead_value) {
      const valueFilter = {};
      if (req.query.value_operator === 'gt') {
        valueFilter.$gt = parseFloat(req.query.lead_value);
      } else if (req.query.value_operator === 'lt') {
        valueFilter.$lt = parseFloat(req.query.lead_value);
      } else if (req.query.value_operator === 'between') {
        const [min, max] = req.query.lead_value.split(',').map(Number);
        valueFilter.$gte = min;
        valueFilter.$lte = max;
      } else {
        valueFilter.$eq = parseFloat(req.query.lead_value);
      }
      filter.lead_value = valueFilter;
    }

    // Boolean field filters
    if (req.query.is_qualified !== undefined) {
      filter.is_qualified = req.query.is_qualified === 'true';
    }

    // Date field filters
    if (req.query.created_at) {
      const dateFilter = {};
      if (req.query.created_operator === 'before') {
        dateFilter.$lt = new Date(req.query.created_at);
      } else if (req.query.created_operator === 'after') {
        dateFilter.$gt = new Date(req.query.created_at);
      } else if (req.query.created_operator === 'between') {
        const [start, end] = req.query.created_at.split(',');
        dateFilter.$gte = new Date(start);
        dateFilter.$lte = new Date(end);
      } else {
        // on specific date
        const startDate = new Date(req.query.created_at);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        dateFilter.$gte = startDate;
        dateFilter.$lt = endDate;
      }
      filter.created_at = dateFilter;
    }

    if (req.query.last_activity_at) {
      const activityFilter = {};
      if (req.query.activity_operator === 'before') {
        activityFilter.$lt = new Date(req.query.last_activity_at);
      } else if (req.query.activity_operator === 'after') {
        activityFilter.$gt = new Date(req.query.last_activity_at);
      } else if (req.query.activity_operator === 'between') {
        const [start, end] = req.query.last_activity_at.split(',');
        activityFilter.$gte = new Date(start);
        activityFilter.$lte = new Date(end);
      } else {
        // on specific date
        const startDate = new Date(req.query.last_activity_at);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        activityFilter.$gte = startDate;
        activityFilter.$lt = endDate;
      }
      filter.last_activity_at = activityFilter;
    }

    // Get total count
    const total = await Lead.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    // Debug: Also check total count without any filter
    const totalWithoutFilter = await Lead.countDocuments({});
    console.log('🔍 Total leads with filter:', total);
    console.log('🔍 Total leads without filter:', totalWithoutFilter);

    console.log('🔍 Leads query - Filter:', JSON.stringify(filter, null, 2));
    console.log('📊 Leads query - Total count:', total);
    console.log('📄 Leads query - Page:', page, 'Limit:', limit, 'Skip:', skip);

    // Get leads
    const leads = await Lead.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get ALL leads without any filter for debugging
    const leadsWithoutFilter = await Lead.find({})
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    console.log('🔍 Leads with filter:', leads.length);
    console.log('🔍 Leads without filter:', leadsWithoutFilter.length);

    console.log('✅ Leads query - Found leads:', leads.length);
    
    // Debug: Show first few leads
    if (leads.length > 0) {
      console.log('📋 Sample lead:', {
        id: leads[0]._id,
        name: `${leads[0].first_name} ${leads[0].last_name}`,
        email: leads[0].email,
        created_by: leads[0].created_by
      });
    }
    
    // Debug: Show leads without filter
    if (leadsWithoutFilter.length > 0) {
      console.log('📋 Sample lead (no filter):', {
        id: leadsWithoutFilter[0]._id,
        name: `${leadsWithoutFilter[0].first_name} ${leadsWithoutFilter[0].last_name}`,
        email: leadsWithoutFilter[0].email,
        created_by: leadsWithoutFilter[0].created_by
      });
    }

    // Always use leads without filter to show all leads
    let finalLeads = leadsWithoutFilter;
    let finalTotal = totalWithoutFilter;
    
    console.log('📊 Final leads count:', finalLeads.length);
    console.log('📊 Final total count:', finalTotal);
    
    res.status(200).json({
      success: true,
      data: finalLeads,
      pagination: {
        page,
        limit,
        total: finalTotal,
        totalPages: Math.ceil(finalTotal / limit)
      }
    });
    
    console.log('📤 Sending response with', finalLeads.length, 'leads');
  } catch (error) {
    console.error('❌ Error in getLeads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    console.log('🔄 Updating lead with ID:', req.params.id);
    console.log('🔄 Update data:', req.body);

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      console.log('❌ Lead not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    console.log('✅ Found lead:', {
      id: lead._id,
      name: `${lead.first_name} ${lead.last_name}`,
      email: lead.email
    });

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    console.log('✅ Lead updated successfully:', {
      id: updatedLead._id,
      name: `${updatedLead.first_name} ${updatedLead.last_name}`,
      email: updatedLead.email
    });

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    console.error('❌ Error updating lead:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    console.log('🗑️ Deleting lead with ID:', req.params.id);

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      console.log('❌ Lead not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    console.log('✅ Found lead to delete:', {
      id: lead._id,
      name: `${lead.first_name} ${lead.last_name}`,
      email: lead.email
    });

    await Lead.findByIdAndDelete(req.params.id);

    console.log('✅ Lead deleted successfully:', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead
};
