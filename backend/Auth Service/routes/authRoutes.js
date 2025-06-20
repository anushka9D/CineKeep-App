const express = require("express");
const router = express.Router();
const verifyToken = require ("../middilewares/authMiddileware");
const authorizeRoles = require("../middlewares/roleMiddileware");
const {} = 

router.get("/admin" , verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Hello Admin wellcome" });
});

module.exports = Router;