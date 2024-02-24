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

exports.getHomePage = (req, res) => {
    // Check if the user is authenticated
    const isAuthenticated = req.session.isAuthenticated || false;

    // Pass the isAuthenticated variable to the template
    res.render('home', { isAuthenticated });
};

module.exports = router;