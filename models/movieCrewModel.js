const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const movie_crew = new Mongoose.Schema({
    movie_id:{
        type:ObjectId,
        ref:'movies',
        required:true
    },
    crew_name: {
        type: String,
        required:true
    },
    crew_image: {
        type: String
    }
})

module.exports = mongoose.model('moviecrew', movie_crew)