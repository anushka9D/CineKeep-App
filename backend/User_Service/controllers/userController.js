const User = require("../models/User");
const bcrypt = require('bcrypt');
const axios = require("axios");

// Create User
exports.createUser = async (req, res) => {
    try {
        const {name, email, phone, password, role} = req.body

        if(!name || !email || !phone || !password || !role){
            return res.status(404).json({message:"User some data are missing"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const upperCaseRegex = /[A-Z]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (!upperCaseRegex.test(password) || !specialCharRegex.test(password)) {
            return res.status(400).json({ message: "Password must contain at least 1 uppercase letter and 1 special character" });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name, email, phone, password:hashedPassword
        });

        const newLogin = {email,password,role};

        try{
            await axios.post('http://localhost:4001/auth/register', newLogin);
            
        }catch(err){
            return res.status(500).json({message:"Error creating login in auth service", error: err.message});
        }

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const userRole = req.user.role;

        if (userRole !== "admin") {
            return res.status(403).json({ message: "You do not have access to this resource." });
        }
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single User
exports.getUserById = async (req, res) => {
    try {
        let userId;
        const userRole = req.user.role;

        if(userRole === "user"){
            userId = req.user.id;
        }
        else if(userRole === "admin"){
            userId = req.params.id;
        }
        else{
            return res.status(403).json({ message: "You do not have access to this resource." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const loginId = req.user.loginId;
        const{name,email,password,phone} = req.body;

        if(!name || !email || !phone){
            return res.status(404).json({message:"Update details are missing"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        let hashedPassword;

        if(password){
            if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }

            const upperCaseRegex = /[A-Z]/;
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

            if (!upperCaseRegex.test(password) || !specialCharRegex.test(password)) {
                return res.status(400).json({ message: "Password must contain at least 1 uppercase letter and 1 special character" });
            }

            hashedPassword = await bcrypt.hash(password,10);
        }

        const updateLogin = { email };
        if (password) {
            updateLogin.password = password; // Send raw password to auth service (assumed logic)
        }

        try{
            await axios.put(`http://localhost:4001/auth/${loginId}`, updateLogin);
            
        }catch(err){
            return res.status(500).json({message:"Error updating login in auth service", error: err.message});
        }

        const updateData = {
            name,
            email,
            phone
        };
        if (hashedPassword) {
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            { _id: userId },
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedUser);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const loginId = req.user.loginId;

        try{
            await axios.delete(`http://localhost:4001/auth/${loginId}`);
            
        }catch(err){
            return res.status(500).json({message:"Error updating login in auth service", error: err.message});
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser){
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
