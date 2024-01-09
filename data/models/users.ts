import mongoose, { Document, Schema } from "mongoose";
import {scopes} from "../users/scopes";

interface Role {
    name: string;
    scopes: (typeof scopes.Admin | typeof scopes.Member | typeof scopes.NonMember | typeof scopes.Anonymous)[];
}

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    age?: number;
    address: string;
    country: string;
}

const RoleSchema: Schema<Role> = new Schema({
    name: { type: String, required: true },
    scopes: [
        {
            type: String,
            enum: [scopes.Admin, scopes.Member, scopes.NonMember, scopes.Anonymous],
        },
    ],
});

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: RoleSchema },
    age: { type: Number },
    address: { type: String, required: true },
    country: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);

