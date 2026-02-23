const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
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
      required: false,
    },

    value: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
  },
  { timestamps: true }
);

// user başına 1 rating
RatingSchema.index(
  { user: 1, contentType: 1, contentId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Rating", RatingSchema);
