const Review = require("../models/Review");

exports.getReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ contentId: id }).populate("user", "username avatarPath");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}