import { asyncHandler,  ErrorHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js"
import { sendToken } from "../utils/sendTokens.js";

export const register = asyncHandler (async (req, res, next) =>{
    const {name, password} = req.body;
    const email = req.body.email.replace(/\s+/g, '').toLowerCase(); 

    if(!name || !email || !password){
        console.log(name, email, password);        
        return next(new ErrorHandler("All Fields are Required!", 400))
    }
    const userExits = await User.findOne({email});
    if(userExits){
        return next(new ErrorHandler("User already Exits. Try with other email or login!", 409))
    }

    const user = await User.create({name, email, password})
    console.log("User Registered ", user);    
    return sendToken(user, res, `Registererd as ${user.name}`)
})

export const login = asyncHandler (async (req, res, next) =>{
    const password = req.body.password;
    const email = req.body.email.replace(/\s+/g, '').toLowerCase();

    if(!email || !password){
        return next(new ErrorHandler("Please Provide Valid Email and Password!", 400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){     
        return next(new ErrorHandler("User not Found. Try Again!", 404))
    }
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return next(new ErrorHandler("Incorrect password. Try Again!", 400))
    }
    console.log("Welcome back!", user.name);    
    return sendToken(user, res, `Welcome back, ${user.name}`);
})