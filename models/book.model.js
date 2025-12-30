const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
    category: String,
  amount: String,
  zone: String,
  description: String,
  coverImage: String,   // ImageKit URL
  imageKitId: String,   // ImageKit file ID
}, {
  timestamps: true
});

module.exports = mongoose.model("Book", BookSchema);



