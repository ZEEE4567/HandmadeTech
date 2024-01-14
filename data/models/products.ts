import mongoose, { Schema, Document, Model } from 'mongoose';
import {productCategories} from "../scopes/productCategories";



interface ICategory extends Document {
  category: (typeof productCategories.Gaming | typeof productCategories.Office | typeof productCategories.Home | typeof productCategories.Mobile | typeof productCategories.Laptop | typeof productCategories.Tablet | typeof productCategories.Camera | typeof productCategories.TV | typeof productCategories.Headphone | typeof productCategories.Speaker | typeof productCategories.Accessory | typeof productCategories.Other)[];
}

const CategorySchema: Schema = new Schema({
  category: [
    {
      type: String,
      enum: [productCategories.Gaming, productCategories.Office, productCategories.Home, productCategories.Mobile, productCategories.Laptop, productCategories.Tablet, productCategories.Camera, productCategories.TV, productCategories.Headphone, productCategories.Speaker, productCategories.Accessory, productCategories.Other],
    }
     ],
});

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ICategory;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: CategorySchema }
});

export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);


