const express = require('express')
const app = express()
const connectdb = require('./config/connectdb')
const mongoose = require('mongoose')
const userRouter = require('./routes/userRoute').router

var morgan = require('morgan')
// morgan middleware
app.use(morgan('tiny'))

require('dotenv').config()

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// temp check (setting up ejs as a render engine)
app.set("view engine", "ejs")

// test route
app.get('/signuptest', (req, res) => {
    res.render('signuptest')
})

// import all the routes here
const home = require('./routes/homeRoute')
const user = require('./routes/userRoute')

// router middleware
app.use('/reSide', userRouter)

    // establishing connection to the database using mongoose.connect
    mongoose.connect(process.env.MONGO_URL) 
    .then(console.log("DB connection succesfull..")) 
    .catch(error=> {
        console.log("DB connection failed");
        console.log(error);
        process.exit(1)
    })

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: ${process.env.PORT}`)
})

//export app.js
module.exports = app;