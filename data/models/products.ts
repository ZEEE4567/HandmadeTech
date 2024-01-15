import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICategory } from './categories';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ICategory['_id'];
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);


