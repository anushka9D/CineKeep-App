const express = require("express");
const router = express.Router();
const verifyToken = require ("../middilewares/authMiddileware");
const authorizeRoles = require("../middlewares/roleMiddileware");
const {createUser,getAllUsers,getUserById,updateUser, deleteUser} = require("../controllers/userController");

router.post("/", verifyToken, authorizeRoles, createUser);
router.get("/", verifyToken, authorizeRoles, getAllUsers);
router.get("/:id", verifyToken, authorizeRoles, getUserById);
router.put("/:id", verifyToken, authorizeRoles, updateUser);
router.delete("/:id", verifyToken, authorizeRoles, deleteUser);

module.exports = router;