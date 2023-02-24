// const Movie = require("../models/movieModel");


// const getCinemaMovie = async (req, res) =>{

//     const {location} = req.params;

//     const cinemas = await 
// }

// const createMovie = async (req, res)=>{
//     try{
//         const {id} = req.params;
//         const {movie_info} = req.body

//         // const {movie_name, movie_rating, movie_language, movie_genre, movie_duration, movie_release, movie_info , movie_cast, movie_location } = req.body
    
//         // const movie = await Movie.findById(id);
    
//         // if(movie)
//         // return res.status(400).json({success:false, msg:"Movie already exist"})
    
//         // 
//         // const movies = await Movie.find({movie_info})

//         const movy = await Movie.findById(id).populate({
//             path:'movie_cast',
//             model:'moviecast'
//         })
//     return res.status(200).json({success:true, msg:"Movie added successfully", movy})
//     }
//     catch(err){
//         return res.status(500).json({success:false, msg:err})
//     }
// }

// module.exports = {
   
// }