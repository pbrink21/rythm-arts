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
    perks: {
        type: [Boolean],
        default: [0,0,0,0,0,0,0,0,0]
    },
    circles: {
        hit: Number,
        miss: Number
    },
    games: {
        won: Number,
        lost: Number
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;