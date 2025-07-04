const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

//Routers
app.use("/auth", require("./routes/authRoutes"));

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

/*

const cookieParser = require('cookie-parser');
const csrf = require('csurf');


// Parse cookies (needed for csurf)
app.use(cookieParser());


// Enable CSRF protection (storing token in a cookie)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production' // use HTTPS in production
  }
});

// Apply the CSRF protection to routes that change state (e.g. POST, PUT, DELETE)
app.use(csrfProtection);

*/