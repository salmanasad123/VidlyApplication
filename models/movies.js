
const mongoose = require('mongoose');
const Joi = require('joi');
const { GenreSchema } = require('./genres');

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        genre: GenreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255      // required number between 0 and 255(cuz we dont want a malicious client to send a                    large number)
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

var Movie = mongoose.model("Movie", moviesSchema);

function validateMovie(movie) {
    // what we have here as Joi Schema is what the client sends us (input to our API) eg data submitted as json object or forms

    const schema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.string().required(),                  // because we want client to send only genreId
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    let result = Joi.validate(movie, schema);
    return result;
};

module.exports.Movie = Movie;
module.exports.validateMovies = validateMovie;