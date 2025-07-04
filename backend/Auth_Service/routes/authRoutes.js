const express = require("express");
const router = express.Router();
const {register,checkLogin} = require("../controllers/authController")
const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: "Too many login attempts. Please try again later."
});

router.get("/register" ,register);
router.get("/login" ,loginLimiter,checkLogin);

module.exports = Router;