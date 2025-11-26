const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Change the origin to allow your live Vercel frontend URL
app.use(cors({
  origin: 'https://jvm-autohub.vercel.app', // <-- FIX: Use your Vercel URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

app.use('/uploads', express.static(uploadsDir));

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jvm-autohub';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err.message));

app.get('/', (req, res) => {
  res.json({ 
    message: '🚗 JVM AutoHub API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🎉 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});