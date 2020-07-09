const express = require('express');
const { urlencoded, json } = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const databaseString = 'mongodb://localhost:27017/users';
mongoose.connect(databaseString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', function () {
    console.log('Succesfull connection!');
});

mongoose.connection.on('error', (error) => {
    console.log('Error: ', error);
});

app.use(json());
app.use(urlencoded({ extended: false }));

const usersRoutes = require('./routes/api/users');
app.use('/api/users', usersRoutes);

app.use(function (req, res, next) {
    const error = new Error('Request is not accepted!');
    error.status = 405;

    next(error);
});

app.use(function (error, req, res, next) {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        error: {
            message: error.message,
            status: statusCode,
            stack: error.stack,
        },
    });
});

module.exports = app;
