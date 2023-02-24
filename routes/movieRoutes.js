const express = require("express")
const router = express.Router();
const movieCpntroller = require("../controller/movieController")

router.post('/create/:id', movieCpntroller.createMovie)
router.post('/cast', movieCpntroller.addCast)

module.exports = router;