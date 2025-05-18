const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = await User.create({ email, password });

    res.status(201).json({
      message: "Registration done",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 360000,
    });

    res.status(200).json({
      message: "Login done",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    message: "Logout successful",
  });
};

module.exports = { registerUser, loginUser, logout };