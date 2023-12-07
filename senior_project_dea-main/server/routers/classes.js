/** @namespace /classes */
const express = require('express')
const router = express.Router()

//Import user controller functions
const {
    createClass,
    removeClass,
    addStudent,
    removeStudent,
    getAllClasses
} = require('../controllers/classes.js')

//Connect classes controller functions to endpoints

router.post('/createClass', createClass)

router.delete('/removeClass', removeClass)

router.post('/addStudent', addStudent)

router.post('/removeStudent', removeStudent)

router.post('/getAllClasses', getAllClasses)


module.exports = router