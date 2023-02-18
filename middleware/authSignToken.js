const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const authSignToken = (req, res, next)=>{
    try{
        const token = req.header("accesstoken") || req.header("Authorization")

        if(!token)
        return res.status(401).json({success:false, msg:"Please login or signup before proceeding"})
    
        const tokenn = token.replace(/^Bearer\s+/, "")
    
        const verifyToken = jwt.verify(tokenn, process.env.SECRET_KEY_TWO, async(err, payload)=>{
            if(err)
            return res.status(401).json({success:false, msg:"Invalid or expired token"})

            const id = payload._id;
            const user = await User.findById(id)

            if(!user)
            return res.status(404).json({success:false, msg:"User by this email does not exist"})

            next();
        })  
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:false, msg:err})
    }
}

module.exports = authSignToken