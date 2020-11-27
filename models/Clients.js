const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, 'Please add a first name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },

    lname: {
        type: String,
        required: [true, 'Please add a last name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },

    gender: {
        type: String,
        required: [true, 'Please add a gender'],
    },

    DOB: {
        type: String,
        required: [true, 'Please add a date of birth']
    },

    phone: {
        type: String,
        unique: true,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
      },

    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ]
      },

    address: {
        type: String,
        required: [true, 'Please add an address'],
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    file: {
        type: String,
        default: 'No file uploaded' 
    }
});

module.exports = mongoose.model('Client', ClientSchema);
  