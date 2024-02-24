const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Home page route
router.get('/', (req, res) => {
    // Check if the user is authenticated and retrieve fullName from the session
    const isAuthenticated = req.session.isAuthenticated || false;
    const fullName = req.session.fullName || ''; // Adjust this according to your application's logic

    // Render the home page view and pass the isAuthenticated and fullName variables to it
    res.render('home', { isAuthenticated, fullName });
});

// Login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Register routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

module.exports = router;
