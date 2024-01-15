import mongoose, {Schema} from "mongoose";

export interface IOrder {
    products: Schema.Types.ObjectId[];
    quantities: number[];
    totalPrice: number;
    date: Date;
}

export const OrderSchema: Schema<IOrder> = new Schema({
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    quantities: [Number],
    totalPrice: Number,
    date: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);