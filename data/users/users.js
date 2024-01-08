let mongoose = require("mongoose");
let scopes = require("./scopes");

let Schema = mongoose.Schema;

let RoleSchema = new Schema({
    name: { type: String, required: true },
    scopes: [
        {
            type: String,
            enum: [scopes.Admin, scopes.Member, scopes.NonMember, scopes.Anonymous],
        },
    ],
});


let UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: RoleSchema },
    age: { type: Number },
    address: { type: String, required: true },
    country: { type: String, required: true },
});


let User = mongoose.model("User", UserSchema);


module.exports = User;
