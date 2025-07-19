const User = require("../models/User");
const axios = require("axios");

// Create User
exports.createUser = async (req, res) => {
    try {
        const {name, email, phone, password, role} = req.body

        if(!name || !email || !phone || !password || !role){
            return res.status(404).json({message:"User some data are missing"});
        }

        const newUser = new User({
            name, email, phone, password
        });

        const newLogin = {email,password,role};

        try{
            await axios.post('http://localhost:4003/auth/register', newLogin);
            
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
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
