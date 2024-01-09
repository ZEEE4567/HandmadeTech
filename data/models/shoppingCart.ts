import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the CartItem document interface
interface ICartItem extends Document {
  productId: typeof Schema.Types.ObjectId;
  quantity: number;
}

// Define the Cart document interface
interface ICart extends Document {
  userId: typeof Schema.Types.ObjectId;
  items: ICartItem[];
  total: number;
}

// create a schema for CartItem
const cartItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

// create a schema for Cart
const cartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  total: { type: Number, default: 0 },
});

// the schema is useless so far
// we need to create a model using it
export const Cart: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);

// make this available to our users in our Node applications
