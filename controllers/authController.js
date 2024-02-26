const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');

exports.getHome = (req, res) => {
    // Get the full name of the user from the session or wherever it's stored
    const fullName = req.session.fullName; // Adjust this according to your application's logic

    // Render the home page view and pass the fullName variable to it
    res.render('home', { fullName });
};

exports.getLogin = (req, res) => {
    res.render('login', { error: req.flash('error') });
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user not found, or if the password is incorrect, render login page with error message
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error', 'Invalid email or password');
            return res.render('login', { error: req.flash('error') });
        }

        // If login successful, set session and redirect to home page
        req.session.userId = user._id;
        req.session.isAuthenticated = true;
        req.session.fullName = user.fullName; // Set the fullName in session
        req.flash('success', 'Login successful');
        res.redirect('/auth/'); // Redirect to the home page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong');
        res.redirect('/auth/login');
    }
};


exports.logout = (req, res) => {
    // Clear authentication status and username from session
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            res.redirect('/'); // Redirect to home page if logout fails
        } else {
            res.redirect('/auth/login'); // Redirect to login page after successful logout
        }
    });
};

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.postRegister = [
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    // Add more validation rules for other fields as needed

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/register');
        }

        try {
            // Check if the email already exists in the database
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                req.flash('error', 'Email already exists');
                return res.redirect('/register');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Create a new user
            const user = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode,
                country: req.body.country,
                profilePicture: req.body.profilePicture,
                occupation: req.body.occupation,
                referralSource: req.body.referralSource,
                password: hashedPassword
            });

            // Save the user to the database
            await user.save();

            // Redirect to login page after successful registration
            req.flash('success', 'Registration successful. Please login.');
            res.redirect('/auth/login'); // Redirect to the login page
        } catch (error) {
            console.error(error);
            req.flash('error', 'Something went wrong');
            res.redirect('/auth/register');
        }
    }
];