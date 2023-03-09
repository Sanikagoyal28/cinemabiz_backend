const express = require("express")
const router = express.Router();
const movieController = require("../controller/movieController")
const authVerifyToken = require("../middleware/authVerifyToken");

router.get('/movie/:id', movieController.get_one_movie)
router.get('/get_movies/:location', movieController.get_movies)
router.post('/add_movies', movieController.create_movie)
router.get('/movies/:location/:language', movieController.language_movie)

module.exports = router;