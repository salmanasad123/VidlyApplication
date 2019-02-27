const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const lodash = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');

// get the information about currently logged in user, we dont pass id to get the user we get id from json web token by decoding

router.get('/me', auth, async function (req, res) {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async function (req, res) {
    try {
        let result = validateUser(req.body);
        if (result.error) {
            res.status(400).send(result.error.message);
            return;
        }
        // checking if the user is not already registered

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).send("User already registered");
            return;
        }

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        // we can use salt to hash our passsword
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        user = await user.save();

        // we assume that when user signs in for our application they are automatically logged in, when they create their account they are logged in

        const token = user.generateAuthToken();

        // we dont want to send the password to the user as a response so we use a library called lodash
        user = lodash.pick(user, ['_id', 'name', 'email'])

        // we send the token in the response header, so we set custom header with x- prefix, first argument is the header name and second is the header value

        res.header('x-auth-token', token).send(user);
    } catch (err) {
        res.send(err.message);
    }
});


module.exports = router;