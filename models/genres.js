const mongoose = require('mongoose');
const Joi = require('joi');



// define schema for genres
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

// Helper Function
var validateGenre = function (genre) {
    let schema = {
        name: Joi.string().min(5).max(50).required()
    }
    let result = Joi.validate(genre, schema);
    return result;
};

module.exports.GenreSchema = GenreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
