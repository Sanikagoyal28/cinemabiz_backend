const authVerifyToken = async (req, res, next)=>{
    try{

        next();
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

module.exports = authVerifyToken