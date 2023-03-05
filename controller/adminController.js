const Cinema = require("../models/cinemaModel")
const Movie = require('../models/movieModel')
const MovieCast = require("../models/movieCastModel")
const MovieCrew = require("../models/movieCrewModel")
const Admin = require('../models/admin_model')

const addCinema = async (req, res) =>{
    try{
        const { admin_id, cinema_name, cinema_location, cinema_rating, cinema_distance } = req.body

        const user = await Admin.findById(admin_id)
    
        if (!user)
            return res.status(400).json({ success: false, msg: "No User by this Id found" })
    
        const cinema = await Cinema.findOne({ cinema_name })
    
        if (cinema)
            return res.status(400).json({ success: false, msg: "Cinema by this name already exists" })
    
        const new_cinema = await Cinema.create({
            admin_id,
            cinema_name:cinema_name.toLowerCase(),
            cinema_rating,
            cinema_distance,
            cinema_location:cinema_location.toLowerCase()
        })
    
        await Admin.findByIdAndUpdate(admin_id, {
            $addToSet:{admin_cinemas:new_cinema._id}
        })
    
        return res.status(200).json({success:true, msg:"New Cinema added successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const addMovie = async (req, res) => {

    try{
        const {cinema_id, movie_id} = req.body

        const cinema = await Cinema.findById(cinema_id)

        if(!(cinema_id && movie_id))
        return res.status(400).json({success:false, msg:"Inputs are required"})
    
        if (!cinema)
            return res.status(400).json({ success: false, msg: "No Cinema by this Id found" })
    
        const movie = await Movie.findById({_id:movie_id })
    
        if (!movie)
            return res.status(400).json({ success: false, msg: "No such movie found" })

        //search for movie in cinema
        const movie_in_cinema = await Cinema.findOne({cinema_id, cinema_movies:{$elemMatch:movie_id}})
        console.log(movie_in_cinema)
    
        await Cinema.findByIdAndUpdate(cinema_id, {
            $addToSet:{cinema_movies:movie_id}
        })
    
        return res.status(200).json({success:true, msg:"New movie added successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const addCast = async (req, res)=>{
    try{
        const {movie_id , actor_name} = req.body;

        const movie = await Movie.findById(movie_id)

        if(!movie_id)
        return res.status(200).json({success:false, msg:"Movie Id is not given"})

        if(!(actor_name))
        return res.status(200).json({success:false, msg:"All inputs are required"})
    
        if(!movie)
            return res.status(400).json({ success: false, msg: "No movie by this Id found" })
    
        const moviecast =  await MovieCast.create({
            movie_id,
            actor_name:actor_name.toLowerCase(),
        })
    
        await Movie.findByIdAndUpdate(movie_id, {
            $addToSet:{
                movie_cast: moviecast._id
            }
        })
        return res.status(200).json({success:true, msg:"Movie cast added successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const addCrew = async (req, res)=>{
    try{
        const {movie_id , crew_name} = req.body;

        const movie = await Movie.findOne({movie_id})
    
        if(!movie)
            return res.status(400).json({ success: false, msg: "No movie by this Id found" })
    
        const moviecrew =  await MovieCrew.create({
            movie_id,
            crew_name:crew_name.toLowerCase(),
        })
    
        await Movie.findByIdAndUpdate(movie_id, {
            $addToSet:{
                movie_crew: moviecrew._id
            }
        })
        return res.status(200).json({success:true, msg:"Movie Crew added successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

module.exports = {
    addMovie,
    addCast,
    addCrew,
    addCinema
}