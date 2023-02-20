const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes")
const cors = require("cors")
const port = 4000;
const DB = "mongodb+srv://sanika:abcd1234@cluster0.kxfedro.mongodb.net/cinemabiz";
const app = express();
app.use(express.json())
app.use(cors({origin:true}))

//connecting mongodb 

mongoose.connect(DB)
.then(()=>{
    app.listen(port);
    console.log(`connected to port : ${port}`);
})
.catch((err)=>{
    console.log(err)
});
// app.listen(port)
app.use(authRoutes)


