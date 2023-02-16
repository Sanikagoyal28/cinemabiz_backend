const express = require("express")
const router = express.Router();
const authController = require("../controller/authController")

router.post("/login", authController.login)
router.post("/forgot_password", authController.forgotPassword)

module.exports = router;