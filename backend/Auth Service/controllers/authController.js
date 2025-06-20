const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Login = require("../models/authModel");

exports.register = async(req,res) =>{
    try{
        const {email,password,role} = req.body;

        if(!email || !password || !role){
            return res.status(404).json({message:"Login details are missing"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const login = new Login({email,hashedPassword,role});
        await login.save();
        res.status(201).json({message:"login create successfuly."});

    }catch(error){
        res.status(500).json({error: error.message});
    }
};