import mongoose, { Schema, Document, Model } from 'mongoose';


interface IProduct extends Document {
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
}


const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true},
  price: { type: Number, required: true},
  category: { type: String, required: true},
});


export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);



