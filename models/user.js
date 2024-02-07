const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name:{
        type: String,
        required: [true, 'please provide a name'],
        maxLength: [40, 'name should be under 40 characters'],
    },
    email:{
        type: String,
        required: [true, 'please provide a email'],
        validate: [validator.isEmail, 'please enter email in correct format'],
        unique: true,
    }
})

module.exports = mongoose.model('User', userSchema)