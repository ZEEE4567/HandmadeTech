let mongoose = require("mongoose");
let Schema = mongoose.Schema;


let ProductSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true},
  price: { type: Number, required: true},
  category: { type: String, required: true},
});


let Products = mongoose.model("Product", ProductSchema);

module.exports = Products;
