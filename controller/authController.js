const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require("dotenv").config();

const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
       
        if(!(email && password)){
            return res.status(400).json({success:false, msg:"Email ID and password is required"})
        }
        
        //checks for user in database
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
        
        //generate otp for the email

    }
    catch(err){
        return res.status(500).json({success:false, msg:err});
    }
}

module.exports = {
    login,
    forgotPassword
}