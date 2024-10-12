const authMiddleware = require('../middleware/auth');

const express = require('express');
const CardUser = require('../models/User');
const router = express.Router();

// Secret key for JWT (stored in .env)
const JWT_SECRET = process.env.JWT_SECRET;


// GET /api/auth/users - Get all users (restricted)
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await CardUser.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/auth/users/:id - Get user by ID (restricted)
router.get('/user/:id', authMiddleware, async (req, res) => {
    try {
        const user = await CardUser.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;


