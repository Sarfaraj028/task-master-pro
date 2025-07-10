import mongoose from "mongoose";
const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true, 
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    }, 
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    }
})
// Auto delete Expired otps
otpSchema.index({expiresAt: 1}, {expireAfterSeconds: 0})
export const OTP = mongoose.model("OTP", otpSchema)