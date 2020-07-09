const mongoose = require('mongoose');
const User = require('../model/usersModel');

module.exports.getScoresSorted = async (req, res, next) => {
    try {
        const users = await User.find({}).exec();
        users = users.sort((a, b) => { return a.score - b.score; });
        res.status(200).json(users);
    } catch (err) {
        next(err)
    }
}
module.exports.insertScore = async (req, res, next) => {
    const user = new User({
        id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        score: req.body.score,
    });
    try {
        let returnValue = await user.save();
        if (returnValue) {
            res.status(200).json(user);
        } else {
            res.status(301).json({ message: 'Cannot insert user' });
        }
    } catch (err) {
        next(err)
    }
}
