const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  friend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Friend", friendSchema);
