const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    phoneNumber: String,
    profilePicture: { data: Buffer, contentType: String },
    role: { type: String, enum: ['agent', 'customer'] },
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    profilePicture: String,
    occupation: String,
    referralSource: String,
    newsletterSubscription: { type: Boolean, default: false },
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;