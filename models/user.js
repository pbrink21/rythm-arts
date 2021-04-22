const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_name: {
        type: String,
        required: true
    },
    user_pass: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    perks: { // [perk]
        type: [Boolean],
        default: [false, false, false, false, false, false, false, false, false]
    },
    circles: { // [hit, miss]
        type: [Number],
        default: [0,0]
    },
    games: { // [won, lost]
        type: [Number],
        default: [0,0]
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;