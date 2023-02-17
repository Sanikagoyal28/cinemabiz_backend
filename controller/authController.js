const User = require('../models/userModel')
const Otp = require("../models/otpModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailer = require("../middleware/mailer")
require("dotenv").config();

const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
       
        if(!(email && password)){
            return res.status(400).json({success:false, msg:"Email ID and password is required"})
        }
        
        const user = await User.findOne({email:email})

        if(!user || (user && !user.isSignedUp)){
        return res.status(400).json({success:false, msg:"User by this email doesn't exist"})
        }

        const userPassword = bcrypt.compare(password, user.password)
        if(!userPassword){
            return res.status(400).json({success:false,msg:"Wrong Password"})
        }
 
        // generate a jwt token {data: to pass in, security key, expiry time}
        const token = jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn:"5d"})
        return res.status(200).json({success:true, msg:"Welcome Back to Cinemabiz", token:token})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err});
    }
}

const forgotPassword = async(req, res)=>{
    try{
        const {email} = req.body;

        if(!email){
            return res.status(400).json({success:false, msg:"Email is required"})
        }

        const user = await User.findOne({email:email})

        if(!user || (user && !user.isSignedUp)){
            return res.status(400).json({success:false, msg:"User not found by this email"})
        }
        
        const mailedOtp = otpGenerator.generate(4,
            {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
                digits:true,
            })
        mailer.sendOtp(email, mailedOtp)

        const otpExpire = Date.now() + 300000;

        const otpModel = await Otp.updateOne({email},
            {$set:{
                otp:mailedOtp.toString(),
                expiry:otpExpire
            }}
            )
            console.log(otpModel)

            return res.status(200).json({success:true, msg:`Otp is sent successfully on ${email}`})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err});
    }
}

const otpVerify = async(req,res)=>{
    try{
        const {email, otp} = req.body;

        if(!email)
        return res.status(400).json({success:false, msg:"Email is not given"})

        if(!otp)
        return res.status(400).json({success:false, msg:"Otp is required"});

        const emailOtp = await Otp.findOne({email:email})
        const user = await User.findOne({email:email})

        if(emailOtp.otp!=otp)
        return res.status(400).json({success:false, msg:"Incorrect Otp"})

        if(emailOtp.expiry <= Date.now())
        return res.status(400).json({success:false, msg:"Otp expired"})

        const token = jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn:"5d"})
        return res.status(200).json({success:true, msg:"Otp verified successfully", token:token})

    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}



module.exports = {
    login,
    forgotPassword,
    otpVerify,
    
}