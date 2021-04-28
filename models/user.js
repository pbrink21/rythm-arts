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
    circleshit: {
        type: Number,
        default: 0
    },
    circlesmiss: {
        type: Number,
        default: 0
    },
    gameswon: {
        type: Number,
        default: 0,
    },
    gameslost: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;