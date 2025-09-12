const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead
} = require('../controllers/leadController');
const { validateLead } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   POST /api/leads
// @desc    Create a new lead
// @access  Private
router.post('/', validateLead, createLead);

// @route   GET /api/leads
// @desc    Get all leads with pagination and filtering
// @access  Private
router.get('/', getLeads);

// @route   GET /api/leads/:id
// @desc    Get single lead
// @access  Private
router.get('/:id', getLead);

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', validateLead, updateLead);

// @route   DELETE /api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', deleteLead);

module.exports = router;
