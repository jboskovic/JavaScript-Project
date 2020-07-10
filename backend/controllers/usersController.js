const MongoDBService = require('../MongoDBService');

const mongoDBService = new MongoDBService('mongodb://localhost:27017', 'puzzle');
module.exports.getScoresSorted = async (req, res, next) => {
    try {
        await mongoDBService.connect();

        let users = await mongoDBService.find('users', {}, { score: -1, usernamename: 1 }, 5);
        users = users.sort((a, b) => { return a.score - b.score; }).slice(0, 5);
        res.status(200).json(users);
        mongoDBService.disconnect();
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
        await mongoDBService.connect();
        await mongoDBService.insert('scores', {
            score: parseInt(s),
            name: u
        });
        res.status(200).json({ message: 'true' });
        mongoDBService.disconnect();

    } catch (err) {
        next(err)
    }
}
