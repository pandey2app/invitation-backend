const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CardUser = require('../models/cardUser');
const router = express.Router();

// Secret key for JWT (stored in .env)
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        let user = await CardUser.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new CardUser({
            name,
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '10h' });

        res.status(201).json({ token, username : user.username });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// POST /api/auth/login - Log in a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    
    try {
        let user = await CardUser.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        console.log(username, password , JWT_SECRET);
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '10h' });

        res.status(200).json({ token, username : user.username });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
