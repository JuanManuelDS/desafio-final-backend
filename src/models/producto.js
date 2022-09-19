const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: { type: String, required: true, max: 200 },
  price: { type: Number, required: true, max: 1000000000 },
  description: { type: String, required: true, max: 5000 },
  thumbnail: { type: String, required: true, max: 10000 },
  timestamp: { type: Date, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
