const express = require('express');
const router = express.Router();
const controller = require('../../controllers/usersController');

router.get('/', controller.getScoresSorted);
router.post('/', controller.insertScore);

module.exports = router;