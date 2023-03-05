const express = require("express");
const mongoose = require("mongoose");
const movieRoutes = require('./routes/movieRoutes')
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require('./routes/adminRoutes')
const cinemaRoutes = require('./routes/cinemaRoutes')
const cors = require("cors")
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload')
const port = 3001;
const DB = "mongodb+srv://sanika:abcd1234@cluster0.kxfedro.mongodb.net/cinemabiz";
const app = express();
app.use(express.json())
const corsOptions = {
    origin: true,
    credentials: true,           //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))

// for uploading file via form-data
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 }
}));

// Cloudinary configuration 
cloudinary.config({
    cloud_name: "dclms6pnb",
    api_key: "577253582489757",
    api_secret: "1oN-Dd2FmzbohbdgbuzuqO6PTMM"
});

//connecting mongodb 
mongoose.connect(DB)
    .then(() => {
        app.listen(port);
        console.log(`connected to port : ${port}`);
    })
    .catch((err) => {
        console.log(err)
    });

app.use(authRoutes)
app.use(movieRoutes)
app.use('/admin', adminRoutes)
app.use(cinemaRoutes)

