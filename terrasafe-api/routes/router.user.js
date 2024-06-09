// routes/user.router.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/controller.user');

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);

module.exports = router;
