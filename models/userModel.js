const mongoose = require("mongoose")

//create a schema for user model
const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        // unique:true
    },
    password: {
        type:String,
        required:true,
    },
    isSignedUp: {
        type:Boolean,
        default:false
    }
})

//connecting model with DB
module.exports = mongoose.model("user", userSchema)