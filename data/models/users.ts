import mongoose, { Document, Schema } from "mongoose";
import { scopes } from "../scopes/userScopes";
import jwt from "jsonwebtoken";
import config from "../../config";
import {IOrder, OrderSchema} from "./orders";


interface IRole {
    name: string;
    scopes: (typeof scopes.Admin | typeof scopes.User)[];
}

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    role: IRole;
    age?: number;
    address: string;
    country: string;
    orders: IOrder[];
}

export const RoleSchema: Schema<IRole> = new Schema({
    name: { type: String, required: true, default: 'User'},
    scopes: [
        {
            type: String,
            enum: [scopes.Admin, scopes.User],
            default: [scopes.User],
        },
    ],
});

export const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: RoleSchema },
    age: { type: Number },
    address: { type: String, required: true },
    country: { type: String, required: true },
    orders: [OrderSchema],
});



export const User = mongoose.model<IUser>("User", UserSchema);

