const mongoose = require('mongoose');

const CardUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cards: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Card',
        default: []
    }
});

module.exports = mongoose.model('CardUser', CardUserSchema);
