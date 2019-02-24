const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');

const p = mongoose.connect('mongodb://localhost/vidly');
p.then(function () {
    console.log("Connected to mongodb ");
}).catch(function (err) {
    console.log("Error connecting to mongodb ", err);
});


app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});