const mongoose = require('mongoose');

// Define Card schema
const CardSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CardUser', // Referencing the User model
        required: true,
    },
    guestname: {
        type: String,
        required: true,
        trim: true,
    },
    guestabout: {
        type: String,
        trim: true,
        default: 'reader',
    }
});

module.exports = mongoose.model('Card', CardSchema);
