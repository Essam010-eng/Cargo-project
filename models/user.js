const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Enter username"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Enter password"],
        minlength: 6
    },
    email: {
        type: String,
        required: [true, "Enter email"],
        unique: true,
        lowercase: true
    },
    role : {
        type : String,
        enum :["admin","seller"],
        required : true ,
        trim : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);
