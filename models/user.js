const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    reset_OTP:String
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
