const Cinema = require('../models/cinemaModel');
const movieCastModel = require('../models/movieCastModel');

const getCinemaAndMovie = async (req, res) => {
    try {
        const { location } = req.params;

        //no location found

        const cinema = await Cinema.find({ cinema_location: location.toLowerCase() })

        const cinemas = await Cinema.find({ cinema_location: location.toLowerCase() }).
            populate({
                path: 'cinema_movies'
            })

        // combine all movie arrays of cinema into movies
        var movies = [];
        cinemas.map((c) => {
            c.cinema_movies.map((m) => {
                movies.push(m)
            })
        })

        // find unique movies from array
        const movie = [...new Set(movies.map((m) => m))];

        return res.status(200).json({ success: true, cinema, movie })
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

const get_cinemas = async (req, res) => {
    try {
        const { location } = req.params;

        //no location found

        const cinema = await Cinema.find({ cinema_location: location.toLowerCase() })

        return res.status(200).json({ success: true, cinema })

    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

const get_one_cinema = async (req, res) => {
    try {
        const { id } = req.params;

        const cinema = await Cinema.findById(id).
            populate('cinema_movies')

        if (!cinema)
            return res.status(400).json({ success: false, msg: "No Cinema by this Id found" })

        return res.status(200).json({ success: true, cinema })
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

const search_place = async (req, res) => {
    try {
        const query = new RegExp(req.query.location, 'i') //dynamic string search (case insensitive)
        const locations = await Cinema.find({ cinema_location: query }, {
            __v: 0, _id: 0, admin_id: 0, cinema_distance: 0, cinema_name: 0, cinema_image: 0,
            cinema_rating: 0, cinema_movies: 0
        })

        // await Cinema.createIndex({ cinema_location: "text" })

        // const place = await Cinema.find({ "$text": {" $search": query } })
        // console.log(place)

        console.log(locations)
        const location = await [...new Set(locations.map((l)=>l))];

        return res.status(200).json({ success: true, location })
    }
    catch (err) {
        return res.status(500).json({ success: false, msg: err })
    }
}

module.exports = {
    getCinemaAndMovie,
    get_cinemas,
    get_one_cinema,
    search_place
}