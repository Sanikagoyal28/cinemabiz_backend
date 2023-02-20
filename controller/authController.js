const User = require('../models/userModel')
const Otp = require("../models/otpModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailer = require("../middleware/mailer")
require("dotenv").config();
const regexEmail= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const regexName = /^[A-Za-z\s]*$/;

const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
       
        if(!(email && password)){
            return res.status(400).json({success:false, msg:"Email ID and password is required"})
        }
        
        const user = await User.findOne({email:email.toLowerCase()})

        if(!user || (user && !user.isSignedUp)){
        return res.status(400).json({success:false, msg:"User by this email doesn't exist"})
        }

        const pass = await bcrypt.hash(password, 12)
        const userPassword = await bcrypt.compare(password, user.password)
     
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

        if(!regexEmail.test(email))
        return res.status(400).json({success:false, msg:"Invalid Email format"})

        const user = await User.findOne({email:email.toLowerCase()})

        if(!user || (user && !user.isSignedUp)){
            return res.status(400).json({success:false, msg:"User not found by this email"})
        }
        
        const mailedOtp = otpGenerator.generate(6,
            {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
                digits:true,
            })
        mailer.sendOtp(email, mailedOtp)
        console.log(mailedOtp)

        const otpExpire = Date.now() + 300000;

        const otpModel = await Otp.updateOne({email:email.toLowerCase()},
            {$set:{
                otp:mailedOtp.toString(),
                expiry:otpExpire
            }}
            )
            console.log(otpModel)

            if(otpModel.modifiedCount==0){
                await Otp.create({
                    email:email.toLowerCase(),
                    otp:mailedOtp.toString(),
                    expiry:otpExpire
                })
            }

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

        const emailOtp = await Otp.findOne({email:email.toLowerCase()})
        const user = await User.findOne({email:email.toLowerCase()})

        if(emailOtp.otp!=otp)
        return res.status(400).json({success:false, msg:"Incorrect Otp"})

        if(emailOtp.expiry <= Date.now())
        return res.status(400).json({success:false, msg:"Otp expired"})

        await Otp.deleteOne({email:email.toLowerCase()})

        const token = jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn:"5d"})
        return res.status(200).json({success:true, msg:"Otp verified successfully", token:token})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const resetPassword = async(req, res)=>{
    try{
        const {email, password} = req.body;

        if(!password)
        return res.status(400).json({success:false, msg:"Password is required"})

        if(!regexPassword.test(password)) 
        return res.status(400).json({success:false, msg:"Invalid Password format"})

        const user1 = await User.findOne({email:email.toLowerCase()})

        if(!user1 || (user1 && !user1.isSignedUp))
        return res.status(400).json({success:false, msg:"User doesn't found by this email"})

        if(user1.password == password)
        return res.status(400).json({success:false, msg:"Password is same as previous"})

        const pass = await bcrypt.hash(password,12)

        const user = await User.updateOne({email:email.toLowerCase()},{
            $set:{
                password:pass
            }
        } );

        return res.status(200).json({success:true, msg:"Password changed successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const signUp = async(req, res)=>{
    try{
        const {email} = req.body;

        if(!email)
        return res.status(400).json({success:false, msg:"Email is required"})
    
        if(!regexEmail.test(email))
        return res.status(400).json({success:false, msg:"Invalid Email format"})
    
        const user = await User.findOne({email:email.toLowerCase()})
    
        if(user && user.isSignedUp)
        return res.status(400).json({success:false, msg:"User by this email already exists"})

        if(!user){
            await User.create({
                email:email.toLowerCase(),
                isSignedUp:false
            })
        }
    
        const mailedOtp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
                digits:true,
        })
    
        const otpExpire = Date.now() + 300000;
    
        mailer.sendOtp(email, mailedOtp)
    
        const otpSent = await Otp.updateOne({email},{
            $set:{
                otp:mailedOtp.toString(),
                expiry:otpExpire
            }
        })
    
        if(otpSent.modifiedCount==0){
            await Otp.create({
                email:email.toLowerCase(),
                otp:mailedOtp,
                expiry:otpExpire
            })
        }
        return res.status(200).json({success:true, msg:"Please enter the Otp sent on your email to proceed further"})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const signVerify = async (req, res) =>{
    try{
        const {email, otp} = req.body;

        if(!email)
        return res.status(400).json({success:false, msg:"Email is not given"})

        if(!otp)
        return res.status(400).json({success:false, msg:"Otp is required"});

        const emailOtp = await Otp.findOne({email:email.toLowerCase()})
        const user = await User.findOne({email:email.toLowerCase()})

        if(!emailOtp)
        return res.status(400).json({success:false, msg:"User not found by this email"})

        if(emailOtp.otp!=otp)
        return res.status(400).json({success:false, msg:"Incorrect Otp"})

        if(emailOtp.expiry <= Date.now())
        return res.status(400).json({success:false, msg:"Otp expired"})

        await Otp.deleteOne({email:email.toLowerCase()})

        const token = jwt.sign({_id:user._id},process.env.SECRET_KEY_TWO,{expiresIn:"2h"})
        return res.status(200).json({success:true, msg:"Otp verified successfully", token:token})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const signUpTwo = async (req, res)=>{
    try{
        const {name, email, password} = req.body;

        if(!email)
        return res.status(400).json({success:false, msg:"Email is not given"})

        if(!(name && password))
        return res.status(400).json({success:false, msg:"All inputs are required"})

       if(!regexName.test(name))
       return res.status(400).json({success:false, msg:"Incorrect Name format"})

        if(!regexPassword.test(password))
        return res.status(400).json({success:false, msg:"Incorrect password format"})

        const pass = await bcrypt.hash(password,12)

        const user = await User.findOneAndUpdate({email:email.toLowerCase()},{
            $set:{
                name:name,
                password:pass,
                isSignedUp:true
            }
        })

        const token = jwt.sign({_id:user._id}, process.env.SECRET_KEY,{expiresIn:"5d"})

        return res.status(200).json({success:true, msg:"Welcome to Cinemabiz, User", token:token})

    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

module.exports = {
    login,
    forgotPassword,
    otpVerify, 
    resetPassword,
    signUp,
    signVerify,
    signUpTwo
}