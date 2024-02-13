const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Home page route
router.get('/', authController.getHome);

// Login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Register routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

module.exports = router;