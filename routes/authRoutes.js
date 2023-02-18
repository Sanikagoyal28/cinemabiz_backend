const express = require("express")
const router = express.Router();
const authController = require("../controller/authController");
const authVerifyToken = require("../middleware/authVerifyToken");

router.post("/login", authController.login)
router.post("/forgot_pwd", authController.forgotPassword)
router.post("/otp_verify", authController.otpVerify)
router.post("/reset_pwd",authVerifyToken,authController.resetPassword)


module.exports = router;