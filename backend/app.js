const express = require('express');
const { urlencoded, json } = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const databaseString = 'mongodb://localhost:27017/puzzle';
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

let corsOptions = {
    origin: '*',

    optionsSuccessStatus: 200,
    "Access-Control-Allow-Origin": "*"
};

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors(corsOptions));

const usersRoutes = require('./routes/api/users');
app.use('/users', usersRoutes);

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
