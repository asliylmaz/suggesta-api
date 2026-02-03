const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contentType: {
      type: String,
      enum: ["place", "movie", "series"],
      required: true,
    },

    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "contentType",
    },
  },
  { timestamps: true }
);

// aynı user aynı içeriği 1 kez favorileyebilir
FavoriteSchema.index(
  { user: 1, contentType: 1, contentId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Favorite", FavoriteSchema);
