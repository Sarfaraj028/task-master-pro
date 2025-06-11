import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is Required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        lowercase: true,
        trim: true,
        set: (value) => value.replace(/\s+/g, ""),
        validate: [validator.isEmail, "Please Provide a valid email!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: [6, "Password length must be atleast 6 characters long"],
        select: false
    }
}, 
{
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

export const User = mongoose.Schema("User", userSchema)