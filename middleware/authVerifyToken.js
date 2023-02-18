const jwt = require("jsonwebtoken")
const User = require('../models/userModel')

const authVerifyToken = async (req, res, next)=>{
    try{
        const token = req.header("Authorization") || req.header("accesstoken");

        if(!token)
        return res.status(401).json({success:false, msg:"Please login or Signup before proceeding"})

        const tokenn = token.replace(/^Bearer\s+/, "")

        const tokenVerify = jwt.verify(tokenn,process.env.SECRET_KEY, async(err, payload)=>{
            if(err){
                console.log(err)
            return res.status(401).json({success:false, msg:"Invalid or Expired token"})
            }
            else{
                const id = payload._id;
                console.log(id)
                const user = await User.findById(id)
                if(!user)
                return res.status(400).json({success:false, msg:"User by this email doesn't exist"})
            }
            next();  
        })
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

module.exports = authVerifyToken