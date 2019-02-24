const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    let schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()      // we are going to hash the password 
    }                                                           // convert the user sent password into
    // a longer string and save that to db
    let result = Joi.validate(user, schema);
    return result;
}

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validateUser = validateUser;
