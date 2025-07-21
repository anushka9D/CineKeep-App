const express = require("express");
const router = express.Router();
const {createUser,getAllUsers,getUserById, getUserByEmail, updateUser, deleteUser} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;