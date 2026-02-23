const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Profile (protected)
router.get("/me", auth, userController.getProfile);

// Review (protected)
router.post("/review", auth, userController.postReview);


module.exports = router;
