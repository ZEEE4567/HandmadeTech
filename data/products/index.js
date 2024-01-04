let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// create a schema
let ProductSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true},
  price: { type: Number, required: true},
  category: { type: String, required: true},
});

// the schema is useless so far
// we need to create a model using it
let Product = mongoose.model("Product", ProductSchema);

// make this available to our users in our Node applications
module.exports = Product;
