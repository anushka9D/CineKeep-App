const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
    }
})

module.exports = mongoose.model("Login",authSchema);