const express = require("express");
const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:productId", getProductById);

module.exports = productRoutes;