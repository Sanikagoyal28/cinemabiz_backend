const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const adminSchema = new mongoose.Schema ({
    admin_id:{
        type:ObjectId,
        required:true
    },
    admin_email:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    isSignedUp: {
        type:Boolean,
        default:false
    },
    admin_cinemas:[{
        type:ObjectId,
        ref:'cinemas'
    }]
})

module.exports = mongoose.model('admin', adminSchema)