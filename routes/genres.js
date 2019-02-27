const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Genre, validateGenre } = require('../models/genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', async function (req, res) {
    try {
        var genres = await Genre.find().sort({ name: 1 });   // sort genres by name
        res
            .status(200)
            .send(genres);
    } catch (err) {
        res.send(err.message);
    }
});

// auth middleware function is executed before the aysnc middleware function which is route handler
router.post('/', auth, async function (req, res) {
    // schema for our genre
    let schema = {
        name: Joi.string().min(5).max(50).required()
    }
    let result = Joi.validate(req.body, schema);
    if (result.error) {
        res.status(400)
            .send(result.error.message);
        return;
    }

    let genre = new Genre({
        name: req.body.name
    });
    genre = await genre.save();    // returns the created document which is saved in the database
    res
        .status(200)
        .send(genre);
});


router.put('/:id', auth, async function (req, res) {

    // validate the genre that we are getting in the request body or request before updating database
    try {
        let result = validateGenre(req.body);
        if (result.error) {
            res.status(400).send(result.error.message)
            return
        }
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!genre) {
            res.status(400)
                .send("The genre with the given id was not found")
            return
        }
        res.send(genre);
    } catch (err) {
        res.send(err.message);
    }
});

// to execute middlware functions we put them in array
router.delete('/:id', [auth, admin], async function (req, res) {
    try {
        let genre = await Genre.findById(req.params.id);
        if (!genre) {
            res.status(400)
                .send("The genre with the given id was not found");
            return;
        }
        const deletedGenre = await genre.remove();
        res.status(200).send(deletedGenre);
    } catch (err) {
        res.send(err.message)
    }
});

router.get('/:id', async function (req, res) {
    try {
        let genre = await Genre.findById(req.params.id);
        if (!genre) {
            res.status(400)
                .send("The genre with the given id was not found");
            return;
        }
        res.status(200).send(genre);
    } catch (err) {
        res.send(err.message);
    }
});




module.exports = router;