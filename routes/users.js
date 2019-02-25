const bcrypt = require('bcrypt');
const lodash = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');

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
        // we dont want to send the password to the user as a response so we use a library called lodash

        user = lodash.pick(user, ['_id', 'name', 'email'])

        res.send(user);
    } catch (err) {
        res.send(err.message);
    }
});


module.exports = router;