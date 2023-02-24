const Cinema = require("../models/cinemaModel")
const Movie = require('../models/movieModel')
const MovieCast = require("../models/movieCastModel")
const MovieCrew = require("../models/movieCrewModel")

const addCinema = async (req, res) =>{
    
}

const addMovie = async (req, res) => {

    const { cinema_id, movie_name, movie_rating, movie_language, movie_genre, movie_duration, movie_release, movie_info, movie_cast, movie_location } = req.body

    const cinema = await Cinema.findById(cinema_id)

    if (!cinema)
        return res.status(400).json({ success: false, msg: "No Cinema by this Id found" })

    const movie = await Movie.findOne({ movie_name })

    if (movie)
        return res.status(400).json({ success: false, msg: "Movie by this name already exists" })

    const new_movie = await Movie.create({
        cinema_id,
        movie_name,
        movie_rating,
        movie_cast,
        movie_language,
        movie_duration,
        movie_release,
        movie_info,
        movie_location,
        movie_genre
    })

    await Cinema.findByIdAndUpdate(cinema_id, {
        $addToSet:{cinema_movies:new_movie._id}
    })

    return res.status(200).json({success:true, msg:"New movie added successfully"})
}

const addCast = async (req, res)=>{
    const {movie_id , actor_name} = req.body;

    const movie = await Movie.findOne({movie_id})

    if(!movie)
        return res.status(400).json({ success: false, msg: "No movie by this Id found" })

    const moviecast =  await MovieCast.create({
        movie_id,
        actor_name
    })

    await Movie.findByIdAndUpdate(movie_id, {
        $addToSet:{
            movie_cast: moviecast._id
        }
    })
    return res.status(200).json({success:true, msg:"Movie cast added successfully"})
}

const addCrew = async (req, res)=>{
    const {movie_id , crew_name} = req.body;

    const movie = await Movie.findOne({movie_id})

    if(!movie)
        return res.status(400).json({ success: false, msg: "No movie by this Id found" })

    const moviecrew =  await MovieCrew.create({
        movie_id,
        crew_name
    })

    await Movie.findByIdAndUpdate(movie_id, {
        $addToSet:{
            movie_crew: moviecrew._id
        }
    })
    return res.status(200).json({success:true, msg:"Movie Crew added successfully"})
}

module.exports = {
    addMovie,
    addCast,
    addCrew
}