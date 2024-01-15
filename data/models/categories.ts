import mongoose, {Model, Schema, Types} from "mongoose";


export interface ICategory extends Document {
    _id: Types.ObjectId;
    name: string;
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
});

export const Category: Model<ICategory> = mongoose.model<ICategory>("Category", CategorySchema);
