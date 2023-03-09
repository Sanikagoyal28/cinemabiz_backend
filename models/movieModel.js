const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types;

const movieSchema = new mongoose.Schema({
    cinema_id: {
        type: ObjectId,
        ref:'cinemas',
        // required:true
    },
    movie_name: {
        type: String,
        required: true
    },
    movie_language: [{
        type:String,
    }],
    movie_rating: {
        type: Number,
    },
    movie_genre: [{
        type: String,
    }],
    movie_duration: {
        type: String,
        required: true
    },
    movie_image: {
        type: String
    },
    movie_cover_image: {
        type: String
    },
    movie_votes: {
        type: String,
    },
    movie_release: {
        type: Date,
        required: true
    },
    movie_info: {
        type: String
    },
    movie_cast: [{
      type:ObjectId,
      ref:'moviecast'
    }],
    movie_crew: [{
       type:ObjectId,
       ref:'moviecrew'
    }],
    // movie_reviews: []
})

module.exports = mongoose.model('movies', movieSchema)
