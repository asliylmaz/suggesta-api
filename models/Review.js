const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contentType: {
      type: String,
      enum: ["place", "media"],
      required: true,
    },

    contentId: {
      type: String,
      required: true,
    },

    tmdbType: {
      type: String,
      enum: ["movie", "tv", "series"],
      required: false, // Sadece TMDB içerikleri için
    },

    text: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
