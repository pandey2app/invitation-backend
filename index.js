require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/cards');
const cors = require('cors');

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.get('/', (req, res) =>{
    res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/card', cardRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
