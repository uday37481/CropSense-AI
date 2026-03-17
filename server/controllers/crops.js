
const Crop = require('../models/Crop');

exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ user: req.user.id }).sort({ date: -1 });
    res.json(crops);
  } catch (err) {
    console.error('Get Crops Error:', err.message);
    res.status(500).json({ msg: 'Server error fetching crops' });
  }
};

exports.updateCrop = async (req, res) => {
  const { name, plantingDate, harvestDate } = req.body;

  // Build crop object
  const cropFields = {};
  if (name) cropFields.name = name;
  if (plantingDate) cropFields.plantingDate = plantingDate;
  if (harvestDate) cropFields.harvestDate = harvestDate;

  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) return res.status(404).json({ msg: 'Crop not found' });

    // Make sure user owns crop
    if (crop.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    crop = await Crop.findByIdAndUpdate(
      req.params.id,
      { $set: cropFields },
      { new: true }
    );

    res.json(crop);
  } catch (err) {
    console.error('Update Crop Error:', err.message);
    res.status(500).json({ msg: 'Server error updating crop' });
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) return res.status(404).json({ msg: 'Crop not found' });

    // Make sure user owns crop
    if (crop.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Crop removed successfully' });
  } catch (err) {
    console.error('Delete Crop Error:', err.message);
    res.status(500).json({ msg: 'Server error deleting crop' });
  }
};

exports.addCrop = async (req, res) => {
  const { name, plantingDate, harvestDate } = req.body;

  if (!name || !plantingDate) {
    return res.status(400).json({ msg: 'Name and planting date are required' });
  }

  try {
    const newCrop = new Crop({
      name,
      plantingDate,
      harvestDate,
      user: req.user.id,
    });

    const crop = await newCrop.save();

    res.status(201).json(crop);
  } catch (err) {
    console.error('Add Crop Error:', err.message);
    res.status(500).json({ msg: 'Server error adding crop' });
  }
};
