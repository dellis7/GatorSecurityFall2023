const express = require('express')
const router = express.Router()

const {
    getGameCount,
    getGameByTopic,
    getGameByType,
    getGameById,
    deleteGameById,
    updateGame,
    createGame,
    getCYOAById,
    deleteCYOAById,
    updateCYOA,
    createCYOA,
    getDNDById,
    deleteDNDById,
    updateDND,
    createDND
} = require('../controllers/games.js')

//Overarching Game Question Routes
router.post('/getcount', getGameCount);

router.post('/getByTopic/:topic', getGameByTopic);

router.post('/getByType/:type', getGameByType);

router.post('/getById/:id', getGameById);

router.delete('/delete/:id', deleteGameById);

router.put('/update/:id', updateGame);

router.post('/create', createGame);

//CYOA Subquestion Routes
router.post('/cyoa/getById/:id', getCYOAById);

router.delete('/cyoa/delete/:id', deleteCYOAById);

router.put('/cyoa/update/:id', updateCYOA);

router.post('/cyoa/create', createCYOA);

//DND Subquestion Routes
router.post('/dnd/getById/:id', getDNDById);

router.delete('/dnd/delete/:id', deleteDNDById);

router.put('/dnd/update/:id', updateDND);

router.post('/dnd/create', createDND);

module.exports = router