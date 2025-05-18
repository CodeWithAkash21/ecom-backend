const CartItem = require("../models/Cartitem");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // Check if product is in stock (assuming product has a stock/count property)
    if (product.rating && product.rating.count <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }
    const existingItem = await CartItem.findOne({
      product: product._id,
      user: req.user.userId,
    });
    if (existingItem) {
      return res.status(400).json({
        message: "Product already available in cart",
      });
    }
    await CartItem.create({
      product: product._id,
      user: req.user.userId,
      quantity: 1,
    });
    // Optionally, decrement product stock here if you want to reserve it
    // product.rating.count -= 1;
    // await product.save();
    // Return updated cart
    const cartItems = await CartItem.find({ user: req.user.userId }).populate("product");
    res.status(201).json({
      message: "Product added to cart successfully",
      cart: cartItems,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user.userId }).populate(
      "product"
    );
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    const deleted = await CartItem.findOneAndDelete({
      product: productId,
      user: req.user.userId,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId) || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const updated = await CartItem.findOneAndUpdate(
      { product: productId, user: req.user.userId },
      { quantity },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    res.status(200).json({ message: "Cart item updated", item: updated });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user.userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addToCart, getCart, removeFromCart, updateCartItem, clearCart };