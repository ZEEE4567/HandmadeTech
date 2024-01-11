import mongoose, { Schema, Document, Model } from 'mongoose';


interface ICartItem extends Document {
  productId: typeof Schema.Types.ObjectId;
  quantity: number;
}


interface ICart extends Document {
  userId: typeof Schema.Types.ObjectId;
  items: ICartItem[];
  total: number;
}


const cartItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

const cartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  total: { type: Number, default: 0 },
});


export const Cart: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);


