const express = require("express")
const router = express.Router();
const cinemaController = require('../controller/cinemaController')

// router.post('/get_cinemas/:location', cinemaController.getCinemaAndMovie)
router.get('/get_cinemas/:location', cinemaController.get_cinemas)
router.get('/cinema/:id', cinemaController.get_one_cinema)
router.get('/home/:location', cinemaController.getCinemaAndMovie)

router.get('/search', cinemaController.search_place)

module.exports = router