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

// About Us page route
router.get('/about', (req, res) => {
    // Check if the user is authenticated and retrieve fullName from the session
    const isAuthenticated = req.session.isAuthenticated || false;
    const fullName = req.session.fullName || ''; // Adjust this according to your application's logic

    res.render('about', { isAuthenticated, fullName }); // Pass isAuthenticated and fullName variables
});

// Login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Register routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Dashboard route
router.get('/dashboard', authController.getDashboard);
router.post('/dashboard', authController.postDashboard);

router.get('/profile', authController.getProfileSection);
router.get('/statistics', authController.getStatisticsSection);

// Route for editing profile
router.get('/edit', authController.getEditProfile);
router.post('/edit', authController.postEditProfile);

// Route to render view property page
router.get('/viewProperty', async (req, res) => {
    try {
        // Query the database for property listings
        const properties = await Property.find();

        // Render the view property page and pass the property data to it
        res.render('viewProperty', { properties });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout route
router.get('/logout', authController.logout)

module.exports = router;
