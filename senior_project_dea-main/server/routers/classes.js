const express = require('express')
const router = express.Router()

//Import user controller functions
const {
    createClass,
    removeClass,
    addStudent,
    removeStudent,
    getAllStudents
} = require('../controllers/classes.js')

//Connect classes controller functions to endpoints

router.post('/createClass', createClass)

// router.post('/removeClass', removeClass)
//
// router.post('/addStudent', addStudent)
//
// router.post('/removeStudent', removeStudent)
//
// router.post('/getAllStudents', getAllStudents)



// router.post('/register', register)
//
// router.post('/login', login)
//
// router.post('/userInfo', getUserInfo)
//
// router.put('/update/:id', updateUser)
//
// router.post('/allUsers', getAllUsers)
//
// router.put('/updatelearnscore', checkAnswerAndUpdateScore);
//
// router.post('/checkPrivileges', checkPrivileges)
//
// router.post('/updateScore', updateScore)

module.exports = router