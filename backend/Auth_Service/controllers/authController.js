const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Login = require("../models/authModel");
const axios = require("axios");

exports.register = async(req,res) =>{
    try{
        const {email,password,role} = req.body;

        if(!email || !password || !role){
            return res.status(404).json({message:"Login details are missing"});
        }

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }


        const existingLogin = await Login.findOne({ email });
        if (existingLogin) {
        return res.status(400).json({ message: "Account already exists with this email." });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const login = new Login({email,password:hashedPassword,role});
        await login.save();
        res.status(201).json({message:"login create successfuly."});

    }catch(error){
        res.status(500).json({ message: "Something went wrong." });
    }
};

exports.checkLogin = async (req,res) =>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(404).json({message:"Login details are missing"});
        }

        const login = await Login.findOne({email});

        if(!login){
            return res.status(404).json({message:"Invalide username or password"});
        }

        const isvalidePassword = await bcrypt.compare(password,login.password);

        if(!isvalidePassword){
            return res.status(404).json({message:"Invalide username or password"});
        }

        let userid;

        if(login.role === "user"){
            const user = await axios.get(`http://localhost:4003/users?email=${email}`);

            if(!user){
                return res.status(404).json({message:"User not found"});
            }

            userid = user._id;
        }
        /*else if(login.role === "admin"){
            const admin = await Admin.findOne({email});

            if(!admin){
                return res.status(404).json({message:"User not found"});
            }

            userid = admin._id;
        }*/
        else{
            return res.status(400).json({ message: "Invalid user role" });
        }

        const token = jwt.sign({
            id: userid,
            role: login.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: true,
            maxAge: 2 * 60 * 60 * 1000
        });

        res.status(200).json({token});

    }catch(error){
        res.status(400).json({ message: "Something went wrong." });
    }
};