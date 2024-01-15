import mongoose, {Schema} from "mongoose";

export interface IOrder {
    userId: Schema.Types.ObjectId;
    products: Schema.Types.ObjectId[];
    quantities: number[];
    totalPrice: number;
    date: Date;
}

export const OrderSchema: Schema<IOrder> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User'},
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    quantities: [Number],
    totalPrice: Number,
    date: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);