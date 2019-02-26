const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const lodash = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const config = require('config');

router.post('/', async function (req, res) {
    try {
        let result = validateEmailAndPassword(req.body);
        if (result.error) {
            res.status(400).send(result.error.message);
            return;
        }
        // checking if the user is not already registered

        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send("Invalid Email or Password");
            return;
        }
        // since our password in the db does include the salt so bcyrpt takes that salt and hash the password provided by the user in the request body if the hash match it is successful

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('Invalid Email or Password');
            return;
        }

        // we need to send a json web token as a response, and the server say next time you want to come for any api end point or any resource bring that token along with you, Its like an Id 

        // const token = jwt.sign({ _id: user._id }, "jwtPrivateKey");

        const token = user.generateAuthToken();
        res.send(token);

    } catch (err) {
        res.send(err.message);
    }
});

function validateEmailAndPassword(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    let result = Joi.validate(req, schema);
    return result;
}

module.exports = router;