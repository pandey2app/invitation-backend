const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const CardUser = require('../models/User');
const auth = require('../middleware/auth'); // Import authentication middleware

// POST /api/cards - Create a new card (requires authentication)
router.post('/create', auth, async (req, res) => {
    const { guestname, guestabout } = req.body;
    console.log(guestname, guestabout, req.user);
    

    try {
        const newCard = new Card({
            host: req.user, // Set the host as the logged-in user
            guestname,
            guestabout
        });

        const savedCard = await newCard.save();
        const host = await CardUser.findById(req.user._id)
        host.cards.push(savedCard);
        host.save();
        res.status(201).json(savedCard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/cards - Get all cards (for the logged-in user)
router.get('/', auth, async (req, res) => {
    try {
        const cards = await Card.find({ host: req.user.id }).populate('host', 'username name'); // Populate the host's username
        res.status(200).json(cards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/cards/all - Get all cards with hostnames (admin route)
router.get('/all', async (req, res) => {
    try {
        const cards = await Card.find().populate('host', 'username name'); // Populate the host's username for all cards
        res.status(200).json(cards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/cards/:id - Get a card by ID (only if the logged-in user is the host)
router.get('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id).populate('host', 'username');
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Check if the logged-in user is the host
        if (card.host._id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(card);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;
