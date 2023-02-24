const express = require("express")
const router = express.Router();
const movieController = require("../controller/movieController")

router.get('/movie/:id', movieController.get_movie)

module.exports = router;