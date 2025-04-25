const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  photos: [
    {
      url: String,
      public_id: String,
      caption: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Memory", memorySchema);
