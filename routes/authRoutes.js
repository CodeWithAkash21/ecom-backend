const express = require("express");
const { registerUser, loginUser, logout } = require("../controllers/authControllers"); 
const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logout);

module.exports = authRoutes;
