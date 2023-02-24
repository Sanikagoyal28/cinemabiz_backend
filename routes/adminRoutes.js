const express = require("express")
const router = express.Router();
const adminController = require('../controller/adminController')

router.post('/add_cinema', adminController.addCinema)
router.post('/add_movie', adminController.addMovie)
router.post('/add_cast', adminController.addCast)
router.post('/add_crew', adminController.addCrew)

module.exports = router;