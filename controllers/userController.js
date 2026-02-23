const Rating = require("../models/Rating");
const Review = require("../models/Review");

exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

exports.postReview = async (req, res) => {
  try {
    const { mediaId, rating, comment, contentType = "media", tmdbType } = req.body;

    if (!comment && (!rating || rating === 0)) {
      return res.status(400).json({ message: "Lütfen puan veya yorum girin." });
    }

    let savedReview = null;
    let savedRating = null;

    if (comment && comment.trim() !== "") {
      const review = new Review({
        user: req.user._id,
        contentType,
        contentId: mediaId,
        tmdbType,
        rating: rating || 0,
        text: comment,
      });
      savedReview = await review.save();
    }

    if (rating && rating > 0) {
      savedRating = await Rating.findOneAndUpdate(
        { user: req.user._id, contentType, contentId: mediaId },
        { value: rating, tmdbType },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ review: savedReview, rating: savedRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
