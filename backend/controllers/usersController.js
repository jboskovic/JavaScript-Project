const mongoose = require('mongoose');
const User = require('../model/usersModel');

module.exports.getScoresSorted = async (req, res, next) => {
    try {
        let users = await User.find({}).exec();
        users = users.sort((a, b) => { return a.score - b.score; }).slice(0, 5);
        res.status(200).json(users);
    } catch (err) {
        next(err)
    }
}
module.exports.insertScore = async (req, res, next) => {
    let u = req.body.username;
    let s = req.body.score;
    console.log(req.body);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: u,
        score: s,
    });
    try {
        let returnValue = await user.save();
        if (returnValue) {
            res.status(200).json({ message: 'true' });
        }
    } catch (err) {
        next(err)
    }
}
