const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCrops, addCrop, updateCrop, deleteCrop } = require('../controllers/crops');

// @route   GET api/crops
// @desc    Get all users crops
// @access  Private
router.get('/', auth, getCrops);

// @route   POST api/crops
// @desc    Add new crop
// @access  Private
router.post('/', auth, addCrop);

// @route   PUT api/crops/:id
// @desc    Update crop
// @access  Private
router.put('/:id', auth, updateCrop);

// @route   DELETE api/crops/:id
// @desc    Delete crop
// @access  Private
router.delete('/:id', auth, deleteCrop);

module.exports = router;
