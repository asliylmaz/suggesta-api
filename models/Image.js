const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
