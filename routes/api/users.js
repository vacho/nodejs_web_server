const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.route('/')
    .get(userController.list)
    .post(userController.create);

router.post('/authenticate', userController.authenticate);

module.exports = router;