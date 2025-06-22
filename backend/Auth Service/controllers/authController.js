const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Login = require("../models/authModel");
const User = require("../models");
const Admin = require("../models");

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

exports.checkLogin = async (req,res) =>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(404).json({message:"Login details are missing"});
        }

        const login = await Login.findOne(email);

        if(!login){
            return res.status(404).json({message:"Invalide username or password"});
        }

        const isvalidePassword = await bcrypt.compare(password,login.password);

        if(!isvalidePassword){
            return res.status(404).json({message:"Invalide username or password"});
        }

        let userData;

        if(login.role === "user"){
            const user = await User.findOne({email});

            if(!user){
                return res.status(404).json({message:"User not found"});
            }

            userData = user._id;
        }
        else if(login.role === "admin"){
            const admin = await Admin.findOne({email});

            if(!admin){
                return res.status(404).json({message:"User not found"});
            }

            userData = admin._id;
        }
        else{
            return res.status(400).json({ message: "Invalid user role" });
        }

        const token = jwt.sign({
            userData
            },
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: false,
            maxAge: 2 * 60 * 60 * 1000
        });

        res.status(200).json({token});

    }catch(error){
        res.status(400).json({error:error.message});
    }
}