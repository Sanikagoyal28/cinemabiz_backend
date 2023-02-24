const Movie = require('../models/movieModel');

const get_movie = async (req, res)=>{
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

module.exports = {
    get_movie
}
