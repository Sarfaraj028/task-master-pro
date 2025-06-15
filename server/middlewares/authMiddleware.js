import jwt from "jsonwebtoken";
import { asyncHandler, ErrorHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check if token exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Unauthorized, Token Missing!", 401));
  }

  // 2️⃣ Extract token
  const token = authHeader.split(" ")[1];

  // 3️⃣ Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4️⃣ Attach user to request
  req.user = await User.findById(decoded._id).select("-password");

  // 5️⃣ Move to next middleware 
  next();
});

export default isAuthenticated;
