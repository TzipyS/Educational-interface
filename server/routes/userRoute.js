const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');
const isAdmin = require('../middleware/isAdminMid');

router.get('/', verifyJWT, isAdmin, userController.getAllUsers);
router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;