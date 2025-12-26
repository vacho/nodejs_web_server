const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .get(verifyJWT, userController.list)
    .post(userController.create);

router.post('/authenticate', userController.authenticate);
router.get('/refresh', userController.refreshToken);
router.get('/logout', verifyJWT, userController.logout);

module.exports = router;