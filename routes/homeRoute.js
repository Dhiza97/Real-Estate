const express = require('express')

//Import home controller
const { home } = require('../controllers/homeController')
const router = express.Router()

//Routes
router.route('/').get(home)

module.exports = router