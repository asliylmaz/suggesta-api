const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
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

// Aynı şehir + aynı isim kuralı
PlaceSchema.index({ name: 1, city: 1 }, { unique: true });

module.exports = mongoose.model("Place", PlaceSchema);
