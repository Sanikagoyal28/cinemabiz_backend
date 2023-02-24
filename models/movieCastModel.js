const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const movie_cast = new mongoose.Schema({
    movie_id:{
        type:ObjectId,
        ref:'movies',
        required:true
    },
    actor_name: {
        type: String,
        required:true
    },
    actor_image: {
        type: String
    }
})

module.exports = mongoose.model('moviecast', movie_cast)