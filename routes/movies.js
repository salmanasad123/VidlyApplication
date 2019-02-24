const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Movie, validateMovies } = require('../models/movies');
const { Genre } = require('../models/genres');


router.get('/', async function (req, res) {
    try {
        const movies = await Movie.find();
        if (!movies) {
            res.status(400).send("No Movies Found");
            return;
        }
        res.status(200).send(movies);
    } catch (err) {
        res.send(err.message);
    }
});


router.get('/:id', async function (req, res) {
    try {
        let movie = await Movie.findById(req.params.id);
        if (!movie) {
            res.status(400).send("Movie with the given Id was not found");
            return;
        }
        res.status(200).send(movie);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/', async function (req, res) {
    try {
        let result = validateMovies(req.body);
        if (result.error) {
            res.status(400).send(result.error.message);
            return;
        }
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) {
            res.status(400).send('Invalid Genre');
            return;
        }
        let movie = new Movie({
            title: req.body.title,
            genre: {                        // we didnt go like genre:genre because genre object has version 
                _id: genre._id,              // and we dont want to put the version property (_v)
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            displayRentalRate: req.body.displayRentalRate
        });

        movie = await movie.save();

        res.send(movie);
    } catch (err) {
        res.send(err.message);
    }
});


router.put('/:id', async function (req, res) {
    try {
        let result = validateMovies(req.body);
        if (result.error) {
            res.status(400).send(result.error.message);
            return;
        }
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) {
            res.status(400).send('Genre with the given id was not found');
            return;
        }
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            res.status(400).send("Movie with the given id was not found");
            return;
        }

        movie.set({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        let updatedMovie = movie.save();
        res.status(200).send(updatedMovie);
    } catch (err) {
        res.send(err.message);
    }
});