const bcrypt = require('bcrypt');
// handling file uploads
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-pictures'); // Adjust the destination folder as needed
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

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
        req.session.email = user.email; // Set email in session
        req.session.phoneNumber = user.phoneNumber; // Set phone number in session
        req.session.address = user.address; // Set address in session
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

     // Handle file upload
     upload.single('profilePicture'),

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

            let profilePictureData = null;
            let profilePictureContentType = null;

            // Handle file upload
            if (req.file) {
                profilePictureData = req.file.buffer;
                profilePictureContentType = req.file.mimetype;
            }

            // Create a new user
            const user = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                profilePicture: {
                    data: profilePictureData,
                    contentType: profilePictureContentType
                },
                role: req.body.role,
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

// Controller function for rendering the dashboard page
exports.getDashboard = async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.userId) {
            req.flash('error', 'You must be logged in to access the dashboard');
            return res.redirect('/auth/login');
        }

        // Retrieve user's ID from the session
        const userId = req.session.userId;

        // Find the user in the database by ID
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/auth/login');
        }

        // Render the dashboard template with the user data
        res.render('dashboard', { user: user });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong');
        res.redirect('/auth/login');
    }
};

// Controller function for handling form submission for updating user information
exports.postDashboard = async (req, res) => {
    
};

exports.getProfileSection = (req, res) => {
    // Retrieve user profile data (if needed)
    const userProfileData = {
        fullName: req.session.fullName,
        email: req.session.email,
        address: req.session.address,
        city: req.session.city,
        state: req.session.state,
        zipCode: req.session.zipCode,
        country: req.session.country,
        occupation: req.session.occupation,
        // Add more user profile data as needed
    };

    // Render the profile section
    res.render('dashboard', { user: userProfileData });
};

exports.getStatisticsSection = (req, res) => {
    // Logic to retrieve statistics data and render the statistics page
    res.render('statistics'); // Adjust the view name as per your project setup
};

// Controller function for rendering the edit profile page
exports.getEditProfile = (req, res) => {
    // Retrieve user information from session or database (if needed)
    const user = {
        fullName: req.session.fullName || '', // Adjust according to your logic
        email: req.session.email || '', // Adjust according to your logic
        phoneNumber: req.session.phoneNumber || '', // Adjust according to your logic
        address: req.session.address || '', // Adjust according to your logic
        // Add more fields as needed
    };

    // Render the edit profile view with user information
    res.render('editProfile', { user, fullName: req.session.fullName, isAuthenticated: req.session.isAuthenticated });
};

// Controller function for handling form submission for updating user information
exports.postEditProfile = async (req, res) => {
    try {
        // Retrieve user's ID from the session
        const userId = req.session.userId;

        // Retrieve updated user information from the form
        const { fullName, email, phoneNumber, role, address, city, state, zipCode, country, occupation } = req.body;

        // Find the user in the database by ID
        const user = await User.findById(userId);

        // Update user information with new values
        user.fullName = fullName;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.role = role;
        user.address = address;
        user.city = city;
        user.state = state;
        user.zipCode = zipCode;
        user.country = country;
        user.occupation = occupation;
        // Update more fields as needed

        // Save the updated user information to the database
        await user.save();

        // Update user information in session
        req.session.fullName = fullName;
        req.session.email = email;
        req.session.phoneNumber = phoneNumber;
        req.session.role = role;
        req.session.address = address;
        req.session.city = city;
        req.session.state = state;
        req.session.zipCode = zipCode;
        req.session.country = country;
        req.session.occupation = occupation;
        // Update more fields as needed

        req.flash('success', 'Profile updated successfully');
        res.redirect('/auth/dashboard'); // Redirect back to the dashboard page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong');
        res.redirect('/auth/edit'); // Redirect back to the edit profile page in case of error
    }
};