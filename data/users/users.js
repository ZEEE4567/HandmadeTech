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

// create a schema
let UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: RoleSchema },
    age: { type: Number },
    address: { type: String, required: true },
    country: { type: String, required: true },
});

// the schema is useless so far
// we need to create a model using it
let User = mongoose.model("User", UserSchema);

// make this available to our users in our Node applications
module.exports = User;
