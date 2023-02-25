const express = require("express")
const router = express.Router();
const movieController = require("../controller/movieController")

router.get('/movie/:id', movieController.get_one_movie)
router.get('/get_movies/:location', movieController.get_movies)
router.post('/add_movies', movieController.MOVIES)

module.exports = router;