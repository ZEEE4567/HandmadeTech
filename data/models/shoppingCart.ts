import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
  userId: Schema.Types.ObjectId;
  products: Schema.Types.ObjectId[];
  quantities: number[];
  totalPrice: number;
}

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  quantities: [Number],
    totalPrice: { type: Number, default: 0 },
});

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
