import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    }
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({id:this._id} , "Secret" , {
        expiresIn: "1h"
    });
}

const User = mongoose.model("User",userSchema);

export default User;