const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

//Routers
app.use("/users", require("./routes/userRoutes"));

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