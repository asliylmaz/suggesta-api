const express = require("express");
const router = express.Router();

const mediaController = require("../controllers/mediaController");
const { auth } = require("../middlewares/auth");


// Review (public)
router.get("/reviews/:id", mediaController.getReviews);


module.exports = router;