const express = require('express')
const router = express.Router()

const {post } = require('../controllers/userController')

router.route('/signup').post(post)

module.exports = router