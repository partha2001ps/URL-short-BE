const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    passwordHash: String,
    reset_OTP: String,
    totalurls: { type: Number, default: 0 },
    activationToken: String,
    activated: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
