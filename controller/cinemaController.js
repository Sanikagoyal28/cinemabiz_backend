const Cinema = require('../models/cinemaModel');
const { populate } = require('../models/userModel');

const getCinemaAndMovie = async (req, res) => {
    try {
        const { location } = req.params;

        //no location found

        const cinema = await Cinema.find({ cinema_location: location.toLowerCase() })

        const cinemas = await Cinema.find({ cinema_location: location.toLowerCase() }).
            populate({
                path: 'cinema_movies',
                populate: {
                    path: 'movie_crew'
                },
                populate: {
                    path: 'movie_cast',
                }
            })

            var movies = [];
            cinemas.map((c)=>{
                c.cinema_movies.map((m)=>{
                    movies.push(m)
                })
            })

            console.log(movies)

        return res.status(200).json({ success: true, cinema, movies })
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

const getCinema = async (req, res)=>{
    try{
        const { location } = req.params;

        //no location found

        const cinema = await Cinema.find({ cinema_location: location.toLowerCase() })
          
        return res.status(200).json({success:true, cinema})

    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

const cinema = async (req, res)=>{
    try{
        const { id } = req.params;

        const cinema = await Cinema.findById(id).
        populate('cinema_movies')

        if(!cinema)
        return res.status(400).json({success:false, msg:"No Cinema by this Id found"})
          
        return res.status(200).json({success:true, cinema})

    }
    catch(err){
        return res.status(500).json({success:false, msg:err})
    }
}

module.exports = {
    getCinemaAndMovie,
    getCinema,
    cinema
}