import jwt from "jsonwebtoken"
import { asyncHandler, ErrorHandler } from "../utils/asyncHandler.js"
import { User } from "../models/userModel.js"

const isAuthenticated = asyncHandler ( async (req, res, next) =>{
    const {authorization} = req.headers

    if(!authorization || !authorization.startsWith("Bearer ")){
        return next(new ErrorHandler("Unauthorized, Token Missing! ", 401))
    }

    const token = authorization.split(" ")[1] // [0] = Bearer, [1] = token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded._id).select("-password")
    next()
})

export default isAuthenticated