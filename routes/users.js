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

        user = await user.save();
        res.send(user);
    } catch (err) {
        res.send(err.message);
    }
});


module.exports = router;