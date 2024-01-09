import mongoose, { Schema, Document } from "mongoose";

interface Member extends Document {
  dataCreated: string;
  paymentRegular: boolean;
  cash: number;
  taxNumber: number;
  photo: string;
}

const MemberSchema: Schema = new Schema({
  dataCreated: { type: String },
  paymentRegular: { type: Boolean },
  cash: { type: Number },
  taxNumber: { type: Number, required: true },
  photo: { type: String, required: true, unique: true },
});

export const Member = mongoose.model<Member>("Member", MemberSchema);

