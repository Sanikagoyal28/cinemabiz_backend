const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types;

const cinemaSchema = new mongoose.Schema({
    admin_id:{
        type:ObjectId,
        ref:'admin',
        required:true
    },
    cinema_name: {
        type: String,
        required: true
    },
    cinema_distance: {
        type:String,
    },
    cinema_rating: {
        type: Number,
    },
    cinema_location: {
        type: String,
        required: true
    },
    cinema_image: {
        type: String
    },
    cinema_movies:[{
        type:ObjectId,
        ref:'movies'
    }]
})

module.exports = mongoose.model('cinema', cinemaSchema)


// movie.find(by id).populate(cast) ?