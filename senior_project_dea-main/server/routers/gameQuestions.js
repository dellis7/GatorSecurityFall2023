const express = require('express')
const router = express.Router()

const {
    getCount,
    getByTopic,
    getById,
    deleteById,
    update,
    create
} = require('../controllers/gameQuestions.js')

const { validateQuestion } = require('../validators/questionValidator')

router.post('/game/getcount', getCount)

router.post('/game/get/:topic', getByTopic)

router.post('/game/getById/:id', getById)

router.delete('/game/delete/:id', deleteById)

router.put('/game/update/:id', update)

router.post('/game/create', validateQuestion, create)

module.exports = router