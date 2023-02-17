const express = require("express")
const router = express.Router();
const authController = require("../controller/authController")

router.post("/login", authController.login)
router.post("/forgot_pwd", authController.forgotPassword)
router.post("/otp_verify", authController.otpVerify)

module.exports = router;