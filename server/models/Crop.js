
const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  plantingDate: {
    type: Date,
    required: true,
  },
  harvestDate: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('crop', CropSchema);
