const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user not found or password does not match, redirect back to login page
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // If login successful, set session and redirect to dashboard or profile page
        req.session.userId = user._id;
        req.flash('success', 'Login successful');
        res.redirect('/dashboard'); // Change this to appropriate route
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong');
        res.redirect('/login');
    }
};

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.postRegister = [
    check('email').isEmail().withMessage('Please enter a valid email address'),
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