const express = require('express');
const router = express.Router();
const controller = require('../../controllers/usersController');

router.get('/', controller.getScoresSorted);
router.put('/', controller.insertScore);

module.exports = router;