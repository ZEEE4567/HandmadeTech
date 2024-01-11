import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import config from "../../config";


export const scopes = {
    Admin: 'admin',
    Member: 'member',
    NonMember: 'notMember',
    Anonymous: 'anonymous',
};
interface IRole {
    name: string;
    scopes: (typeof scopes.Admin | typeof scopes.Member | typeof scopes.NonMember | typeof scopes.Anonymous)[];
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: IRole;
    age?: number;
    address: string;
    country: string;
}

export const RoleSchema: Schema<IRole> = new Schema({
    name: { type: String, required: true },
    scopes: [
        {
            type: String,
            enum: [scopes.Admin, scopes.Member, scopes.NonMember, scopes.Anonymous],
        },
    ],
});

export const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: RoleSchema },
    age: { type: Number },
    address: { type: String, required: true },
    country: { type: String, required: true },
});



export const User = mongoose.model<IUser>("User", UserSchema);

