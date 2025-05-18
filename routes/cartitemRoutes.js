const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { addToCart, getCart, removeFromCart, updateCartItem, clearCart } = require("../controllers/cartitemController");

const cartItemRoutes = express.Router();

cartItemRoutes.post("/", protect, addToCart);
cartItemRoutes.get("/", protect, getCart);
cartItemRoutes.delete("/", protect, clearCart);
cartItemRoutes.delete("/item", protect, removeFromCart);
cartItemRoutes.put("/item", protect, updateCartItem);

module.exports = cartItemRoutes;