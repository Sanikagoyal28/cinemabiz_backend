const Movie = require('../models/movieModel');
const Cinema = require('../models/cinemaModel');
const cloudinary = require('cloudinary').v2

const create_movie = async (req, res) => {
    try {
        const { movie_name, movie_rating, movie_language, movie_genre, movie_duration, movie_release, movie_info, movie_cast } = req.body

        const movie = await Movie.findOne({ movie_name: movie_name.toLowerCase() })

        if (movie)
            return res.status(400).json({ success: false, msg: "Movie by this name already exists" })

        // upload a file     
        let movie_image = null;
        const file = req.files? req.files.movie_image: null;
        
        if(file){
            const res = await cloudinary.uploader.upload(file.tempFilePath)
            if(res)
            movie_image = res.url
        }

        if (!movie) {
            await Movie.create({
                movie_name: movie_name.toLowerCase(),
                movie_rating,
                movie_cast,
                movie_language,
                movie_duration,
                movie_release,
                movie_info,
                movie_genre,
                movie_image
            })
        }

        return res.status(200).json({ success: true, msg: "New movie created successfully" })
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

const get_one_movie = async (req, res) => {
    try {

        const { id } = req.params;

        const movie = await Movie.findById(id,{_id:0}).
            populate('movie_cast', {_id:0}).populate('movie_crew')

        if (!movie)
            return res.status(400).json({ success: false, msg: "No Movie by this Id found" })

        return res.status(200).json({ success: true, movie })

    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
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
        var all_movies = [];
        cinemas.map((c) => {
            c.cinema_movies.map((m) => {
                all_movies.push(m)
            })
        })

        // find unique movies from array
        var movies = []
        movies = await [...new Set(all_movies.map((m) => m))];

        var all_languages = [];
        var all_genre = [];
        movies.map((m) => {
            m.movie_genre.map((g) => {
                all_genre.push(g)
            })
            m.movie_language.map((l) => {
                all_languages.push(l)
            })
        })

        // language filter
        var languages = []
        languages = await [...new Set(all_languages.map((m) => m))];

        // genre filter
        var genre = []
        genre = await [...new Set(all_genre.map((m) => m))];

        return res.status(200).json({ success: true, movies, languages, genre })
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

const language_movie = async (req, res)=>{
    try{
        const {language, location} = req.params;

        const cinema = await Cinema.aggregate([
            { $match :{cinema_location:location}},

            { $group:{name:cinema_name}}
        ])
        console.log(cinema)
        console.log("abcd")
        return 
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

module.exports = {
    get_one_movie,
    get_movies,
    create_movie,
    language_movie
}
