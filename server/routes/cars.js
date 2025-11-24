const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, search, minPrice, maxPrice, fuelType, transmission } = req.query;
    
    let query = { isSold: false };
    
    if (search) {
      query.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;

    const cars = await Car.find(query)
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Car.countDocuments(query);

    res.json({
      cars,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('createdBy', 'name email');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const carData = {
      ...req.body,
      createdBy: req.user.id,
      contact: '9876543210'
    };

    if (req.files && req.files.length > 0) {
      carData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const requiredFields = ['make', 'model', 'year', 'price', 'mileage', 'fuelType', 'transmission', 'owner', 'location', 'description'];
    for (let field of requiredFields) {
      if (!carData[field]) {
        return res.status(400).json({ 
          success: false,
          message: `${field} is required` 
        });
      }
    }

    const car = new Car(carData);
    const savedCar = await car.save();
    await savedCar.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Car listed successfully!',
      car: savedCar
    });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

router.get('/my/listings', auth, async (req, res) => {
  try {
    const cars = await Car.find({ createdBy: req.user.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      cars: cars 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

router.patch('/:id/sold', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ 
        success: false,
        message: 'Car not found' 
      });
    }
    
    if (car.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You can only mark your own cars as sold.' 
      });
    }
    
    car.isSold = true;
    car.soldAt = new Date();
    await car.save();
    
    res.json({
      success: true,
      message: 'Car marked as sold successfully',
      car: car
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

router.patch('/:id/available', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ 
        success: false,
        message: 'Car not found' 
      });
    }
    
    if (car.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }
    
    car.isSold = false;
    car.soldAt = null;
    await car.save();
    
    res.json({
      success: true,
      message: 'Car marked as available successfully',
      car: car
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    if (car.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Car.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: 'Car deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;