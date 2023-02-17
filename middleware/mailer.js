const nodemailer = require("nodemailer")

const sendOtp = async(email, otp)=>{
    const msg = {
        from:'Cinemabiz"cinemabiz.email.com"',
        to:email, 
        text: "Reset your Password",
        html:`<div class="otpDiv" style="
            width:80%;
            margin:auto;
            padding:10px">
            <h2 class="otpHead" style="color:#5C3F76">Team Cinemabiz</h2>
            <h3 style="margin-bottom:10px;">Thankyou for using Cinemabiz</h3>
            <p style="margin-bottom:20px;">A password reset event has been triggered. To complete the password reset process, use the following OTP,</p>
            <h1><b style="margin-bottom:20px; color:#5C3F76; font-size=30px;">{otp}</b></h1>
            <p>Otp is valid for 5 minutes. So, make sure to enter the otp within time else you will need to make a new request</p>
        </div>`,
    }

    const transporter = nodemailer.createTransport({
        // host:,
        // port:,
        // secure:,
        // auth:{}
    })

    transporter.sendMail((msg, err)=>{
        console.log(msg)
        if(!err){
        console.log("msg sent successfully")
        return true;
        }
        else{
        console.log(err)
        return false;
        }
    })
}

module.exports = {
    sendOtp
}