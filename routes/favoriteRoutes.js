const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  addToFavourite,
  getFavourites,
  removeFromFavourites,
} = require("../controllers/favouriteController");

const favouritesRoutes = express.Router();

favouritesRoutes.post("/", protect, addToFavourite);
favouritesRoutes.get("/", protect, getFavourites);
favouritesRoutes.delete("/:id", protect, removeFromFavourites);

module.exports = favouritesRoutes;