const express = require('express');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route: Fetch all photos
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const photos = await db.collection('photos').find().toArray();
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos.' });
  }
});

// Route: Upload a photo
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { title, description, coordinates } = req.body;
    
    // Validate required fields
    if (!title || !description || !coordinates) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate coordinates format
    const coordArray = coordinates.split(',').map(Number);
    if (coordArray.length !== 2 || coordArray.some(isNaN)) {
      return res.status(400).json({ error: 'Invalid coordinates format. Expected "lat,lng".' });
    }

    const cloudinary = req.app.locals.cloudinary;
    if (!cloudinary) {
      throw new Error('Cloudinary configuration not found');
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: 'medpfinal',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      stream.end(req.file.buffer);
    });

    // Save to MongoDB
    const db = req.app.locals.db;
    const photoDoc = {
      title,
      description,
      coordinates: coordArray,
      imageUrl: uploadResult.secure_url,
      createdAt: new Date()
    };

    await db.collection('photos').insertOne(photoDoc);

    res.status(201).json({
      message: 'Photo uploaded successfully!',
      photo: photoDoc
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload photo.',
      details: error.message
    });
  }
});

module.exports = router;