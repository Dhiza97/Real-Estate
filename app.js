require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to your MongoDB database using environment variable
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log('E don connect to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware setup
app.use(session({
    secret: 'jujubean',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Use routes
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});