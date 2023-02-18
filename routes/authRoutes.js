const express = require("express")
const router = express.Router();
const authController = require("../controller/authController");
const authVerifyToken = require("../middleware/authVerifyToken");
const authSignToken = require("../middleware/authSignToken")

router.post("/login", authController.login)
router.post("/forgot_pwd", authController.forgotPassword)
router.post("/otp_verify", authController.otpVerify)
router.post("/reset_pwd",authVerifyToken,authController.resetPassword)
router.post("/signup", authController.signUp)
router.post("/signup_verify", authController.signVerify)
router.post("/signup_two",authSignToken, authController.signUpTwo)

module.exports = router;