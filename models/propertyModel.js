const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    propertyType: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    price: { type: Number, required: true },
    propertyImage: {
        data: Buffer,
        contentType: String
    },
    description: { type: String, required: true },
    numberOfBedrooms: { type: Number, required: true },
    numberOfBathrooms: { type: Number, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhoneNumber: { type: String, required: true },
    photos: [{ type: String }], // If storing URLs of uploaded photos
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;