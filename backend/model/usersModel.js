const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0,
    }
});

const usersModel = mongoose.model('User', usersSchema);
module.exports = usersModel;