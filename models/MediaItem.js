const mongoose = require("mongoose");

const MediaItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["movie", "series", "book"],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

MediaItemSchema.index({ title: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("MediaItem", MediaItemSchema);
