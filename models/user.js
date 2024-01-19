const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
},
{ timestamps: true },
);

const User = mongoose.model("User", userSchema);
exports.User = User;