const bcrypt = require('bcrypt');
const multer = require('multer');
const Property = require('../models/propertyModel');
const fs = require('fs');
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
    const fullName = req.session.fullName;
    const isAuthenticated = req.session.isAuthenticated; // Add this line to retrieve isAuthenticated from session

    res.render('home', { fullName, isAuthenticated }); // Pass isAuthenticated to the home template
};

exports.renderHeader = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated; // Retrieve isAuthenticated from session or wherever it's stored
    res.locals.isAuthenticated = isAuthenticated; // Make isAuthenticated available to all templates
    next(); // Call next middleware function
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

// Controller function for handling form submission for updating user information
// exports.postEditProfile = async (req, res) => {
//     try {
//         // Retrieve user's ID from the session
//         const userId = req.session.userId;

//         // Retrieve updated user information from the form
//         const { fullName, email, phoneNumber, role, address, city, state, zipCode, country, occupation } = req.body;

//         // Find the user in the database by ID
//         const user = await User.findById(userId);

//         // Update user information with new values
//         user.fullName = fullName;
//         user.email = email;
//         user.phoneNumber = phoneNumber;
//         user.role = role;
//         user.address = address;
//         user.city = city;
//         user.state = state;
//         user.zipCode = zipCode;
//         user.country = country;
//         user.occupation = occupation;
//         // Update more fields as needed

//         // Save the updated user information to the database
//         await user.save();

//         // Update user information in session (if needed)
//         req.session.fullName = fullName;
//         req.session.email = email;
//         req.session.phoneNumber = phoneNumber;
//         req.session.role = role;
//         req.session.address = address;
//         req.session.city = city;
//         req.session.state = state;
//         req.session.zipCode = zipCode;
//         req.session.country = country;
//         req.session.occupation = occupation;
//         // Update more fields as needed

//         req.flash('success', 'Profile updated successfully');
//         res.redirect('/auth/dashboard'); // Redirect back to the dashboard page
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Something went wrong');
//         res.redirect('/auth/edit'); // Redirect back to the edit profile page in case of error
//     }
// };

exports.postEditProfile = async (req, res) => {
    try {
        // Extract form data
        const { userId, fullName, email, phoneNumber, role, address, city, state, zipCode, country, occupation } = req.body;

        // Update user information in the database
        const updatedUser = await User.findByIdAndUpdate(userId, {
            fullName,
            email,
            phoneNumber,
            role,
            address,
            city,
            state,
            zipCode,
            country,
            occupation
        }, { new: true });

        if (!updatedUser) {
            // User not found
            req.flash('error', 'User not found');
            return res.redirect('/auth/edit');
        }

        // Redirect to the dashboard or profile page with a success message
        req.flash('success', 'Profile updated successfully');
        res.redirect('/auth/dashboard'); // Adjust the redirect URL as needed
    } catch (error) {
        // Handle errors
        console.error(error);
        req.flash('error', 'Something went wrong');
        res.redirect('/auth/edit'); // Redirect back to the edit profile page in case of error
    }
};

exports.getAddListingForm = (req, res) => {
    const fullName = req.session.fullName; // Retrieve the fullName from the session or wherever it's stored
    const isAuthenticated = req.session.isAuthenticated || false; // Set isAuthenticated to false if not defined in session
    res.render('addListingForm', { fullName, isAuthenticated }); // Pass both fullName and isAuthenticated variables to the template
};

exports.submitProperty = async (req, res) => {
    try {
        const {
            propertyType,
            address,
            city,
            state,
            price,
            description,
            numberOfBedrooms,
            numberOfBathrooms,
            contactName,
            contactEmail,
            contactPhoneNumber
        } = req.body;

        // Read the uploaded image file
        const propertyImage = {
            data: fs.readFileSync(req.file.path),
            contentType: req.file.mimetype
        };

        // Create a new property listing
        const property = new Property({
            propertyType,
            address,
            city,
            state,
            price,
            propertyImage,
            description,
            numberOfBedrooms,
            numberOfBathrooms,
            contactName,
            contactEmail,
            contactPhoneNumber
        });

        // Save property to the database
        await property.save();

        res.redirect('/auth/viewProperty'); // Redirect to view property page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};