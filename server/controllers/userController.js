import { asyncHandler, ErrorHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import { OTP } from "../models/otpModel.js";
import { sendToken } from "../utils/sendTokens.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"

// register controler
export const register = asyncHandler(async (req, res, next) => {
  const { name, password } = req.body;
  const email = req.body.email.replace(/\s+/g, "").toLowerCase();

  if (!name || !email || !password) {
    console.log(name, email, password);
    return next(new ErrorHandler("All Fields are Required!", 400));
  }
  const userExits = await User.findOne({ email });
  if (userExits) {
    return next(
      new ErrorHandler(
        "User already Exits. Try with other email or login!",
        409
      )
    );
  }

  //delete any existing otp for this email
  await OTP.deleteMany({ email });

  //generate a six digit otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  //hash the otp before saving
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  //save to otp model
  await OTP.create({
    email,
    otp: hashedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  // Send oto vaia email
  const message = `
    <h1>OTP Verification - Task Master Pro 🔐</h1>
    <p>Your otp is : ${otp}</p>
    <p>It will expire in 5 minutes.</p>
  `;

  try {
    await sendEmail(email, "Verify your email - OTP inside", message);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}. Please verify to complete registration.`,
    });
  } catch (err) {
    console.log("Email Send Error:", err);
    return next(
      new ErrorHandler("OTP send failed. Please try again later.", 500)
    );
  }
});

// otp verification controller 
export const otpVerify = asyncHandler(async (req, res, next) => {
  const {name, email, password, otp} = req.body;

  if(!name || !email || !password || !otp) {
    return next(new ErrorHandler("All fields are required!", 400))
  }

  const normalizedEmail = email.replace(/\s+/g, "").toLowerCase()

  // 1. FInd otp record for this email
  const otpRecord = await OTP.findOne({email: normalizedEmail})
  if(!otpRecord){
    return next(new ErrorHandler("OTP Expired or not Found!", 400))
  }

  // 2. Check otp match (compare hashed version)
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")
  if(hashedOtp !== otpRecord.otp) {
    return next(new ErrorHandler("Invalid OTP", 401))
  }

  // 3. Check Again if user already exists (edge case)
  const userExits = await User.findOne({email: normalizedEmail})
  if (userExits){
    return next (new ErrorHandler("User Already Exists", 409))
  }

  // 4. Create user 
  const user = await User.create({
    name, email: normalizedEmail, password, emailVerified: true
  })

  // 5. Delete otpRecord await
  await OTP.deleteMany({email: normalizedEmail})
  
  // 6. Send token
  console.log("OTP Verified! Account Created!")
  return sendToken(user, res, "OTP Verified, Account Created!", 201)
  
})

export const login = asyncHandler(async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email.replace(/\s+/g, "").toLowerCase();

  if (!email || !password) {
    return next(
      new ErrorHandler("Please Provide Valid Email and Password!", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not Found. Try Again!", 404));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Incorrect password. Try Again!", 400));
  }
  console.log("Welcome back!", user.name);
  return sendToken(user, res, `Welcome back, ${user.name}`);
});

// get profile
export const getProfile = asyncHandler(async (req, res) => {
  console.log(req.user.name);
  return res.status(200).json({
    success: true,
    message: "Profile Fetched Suucessfully!",
    user: req.user,
  });
});
