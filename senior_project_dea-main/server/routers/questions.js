const express = require('express')
const router = express.Router()

const {
    getCount,
    getByTopic,
    deleteById,
    update,
    create,
} = require('../controllers/questions.js')

const { validateQuestion } = require('../validators/questionValidator')

//Overarching Traditional Question Routes (NOTE: Each / should be preceded by /questions when testing with Postman e.g. localhost:5000/questions/getcount)

router.post('/getcount', getCount)

router.post('/get/:topic', getByTopic)

router.delete('/delete/:id', deleteById)

router.put('/update/:id', update)

router.post('/create', validateQuestion, create)

module.exports = router