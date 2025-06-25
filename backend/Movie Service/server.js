const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

//Middleware
app.use(express.json());
app.use(cors());

//Routers


//DB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB connection successfull..!");
        app.listen(process.env.PORT);
        console.log(`Movie service Running on http://localhost:${process.env.PORT}`);
    })
    .catch((error)=>{
        console.log(error);
        process.exit(1);
    })