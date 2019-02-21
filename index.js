const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');

const p = mongoose.connect('mongodb://localhost/vidly');
p.then(function () {
    console.log("Connected to mongodb ");
}).catch(function (err) {
    console.log("Error connecting to mongodb ", err);
});


app.use(express.json());

app.use('/api/genres', genres);

const port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});