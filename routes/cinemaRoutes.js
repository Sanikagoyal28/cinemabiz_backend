const express = require("express")
const router = express.Router();
const cinemaController = require('../controller/cinemaController')

// router.post('/get_cinemas/:location', cinemaController.getCinemaAndMovie)
router.get('/get_cinemas/:location', cinemaController.getCinema)
router.get('/cinema/:id', cinemaController.cinema)

module.exports = router