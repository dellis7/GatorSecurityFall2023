/** @namespace /login */
const express = require('express')
const router = express.Router()

//Import login controller functions
const {
    register,
    login, 
} = require('../controllers/login.js')

//Connect login controller functions to endpoints
//Overarching Login Routes (NOTE: Each / should be preceded by /login when testing with Postman e.g. localhost:5000/login/register)

router.post('/register', register)

router.post('/login', login)

module.exports = router