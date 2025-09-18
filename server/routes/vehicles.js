// ====== IMPORTS ======
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinary');

// ====== ROUTES ======

// @route   GET api/vehicles
// @desc    Get all vehicles OR search for vehicles with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    const limit = 6;
    const skip = (parseInt(page) - 1) * limit;

    let filter = {};
    if (search) {
      filter = { vehicleName: { $regex: search, $options: 'i' } };
    }

    const totalVehicles = await Vehicle.countDocuments(filter);
    const totalPages = Math.ceil(totalVehicles / limit);

    const vehicles = await Vehicle.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    res.status(200).json({ 
      vehicles, 
      totalPages, 
      currentPage: parseInt(page) 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching vehicles', error });
  }
});

// @route   GET api/vehicles/my-listings
// @desc    Get all vehicles for the logged-in user
// @access  Private
router.get('/my-listings', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/vehicles/:id
// @desc    Get a single vehicle by its ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/vehicles/upload
// @desc    Post a new vehicle
// @access  Private
router.post('/upload', auth, (req, res) => {
  const uploader = upload.single('image');
  uploader(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Max limit is 5MB.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: `An unknown error occurred: ${err.message}` });
    }
    
    try {
      if (!req.file) return res.status(400).json({ message: 'No image file uploaded.' });
      
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'campuswheels_preset' });
      
      const newVehicle = new Vehicle({ 
        ...req.body, 
        imageUrl: uploadResponse.secure_url, 
        owner: req.user.id 
      });
      await newVehicle.save();
      res.status(201).json({ message: 'Vehicle listed successfully!', vehicle: newVehicle });
    } catch (error) {
      console.error('Error uploading vehicle:', error);
      res.status(500).json({ message: 'Server error during processing', error });
    }
  });
});

// @route   PUT api/vehicles/:id
// @desc    Update a vehicle
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
    
    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/vehicles/:id
// @desc    Delete a vehicle
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    const imageUrl = vehicle.imageUrl;
    const urlParts = imageUrl.split('/');
    const publicIdWithFolder = urlParts.slice(urlParts.indexOf('upload') + 2).join('/').split('.')[0];
    if (publicIdWithFolder) {
      await cloudinary.uploader.destroy(publicIdWithFolder);
    }
    
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Vehicle removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ====== EXPORT ROUTER ======
module.exports = router;