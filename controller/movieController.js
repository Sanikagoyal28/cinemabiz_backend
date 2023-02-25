const Movie = require('../models/movieModel');
const Cinema = require('../models/cinemaModel');

const MOVIES = async (req, res)=>{
    try{
        const {movie_name, movie_rating, movie_language, movie_genre, movie_duration, movie_release, movie_info, movie_cast} = req.body

        const movie = await Movie.findOne({ movie_name })
    
        if (movie)
            return res.status(400).json({ success: false, msg: "Movie by this name already exists" })
    
        const new_movie = await Movie.create({
            movie_name:movie_name.toLowerCase(),
            movie_rating,
            movie_cast,
            movie_language,
            movie_duration,
            movie_release,
            movie_info,
            movie_genre
        })
    
        return res.status(200).json({success:true, msg:"New movie created successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const get_one_movie = async (req, res)=>{
    try{
        const { id } = req.params;

        const movie = await Movie.findById(id).
        populate('movie_cast', 'movie_crew')

        if(!movie)
        return res.status(400).json({success:false, msg:"No Movie by this Id found"})
          
        return res.status(200).json({success:true, movie})

    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const get_movies = async (req, res) => {
    try {
        const { location } = req.params;

        //no location found

        const cinemas = await Cinema.find({ cinema_location: location.toLowerCase() }).
            populate({
                path: 'cinema_movies'
            })

            // combine all movie arrays of cinema into movies
            var movies = [];
            cinemas.map((c)=>{
                c.cinema_movies.map((m)=>{
                    movies.push(m)
                })
            })

            // find unique movies from array
            const movie = [...new Set(movies.map((m)=>m))];

            var languages = [];
            var genre = [];
            movie.map((m)=>{
                m.movie_genre.map((g)=>{
                    genre.push(g)
                })
                m.movie_language.map((l)=>{
                    languages.push(l)
                })
            })
            console.log(languages)
            console.log(genre)

        return res.status(200).json({ success: true, movie })
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

module.exports = {
    get_one_movie,
    get_movies,
    MOVIES
}
