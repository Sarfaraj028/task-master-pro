import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { toast } from "react-toastify";
import validator from "validator";
import { useAuth } from "../context/authContext.jsx";

//validate email
const isEmailValid = (email) => {
  if (!validator.isEmail(email)) {
    toast.warning("Please enter a valid email address!");
    return false;
  }
  return true;
};

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //1. otp verification
  const [showOTPInput, setShowOTPInput] = useState(false);
  //2. otp verification store top and form details for temporary
  const [otp, setOtp] = useState("");
  const [tempForm, setTempForm] = useState(null); //save user Info untill verify

  const [error, setError] = useState("");

  // for top expire timer
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resendDisabled, setResendDisabled] = useState(true);

  const navigate = useNavigate();
  const { login } = useAuth();

  // timer useEffect
  useEffect(() => {
    let timer;
    if (showOTPInput && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [showOTPInput, timeLeft]);

  // format seconds in mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  //resend otp handler
  const handleResendOTP = async () => {
    if (!tempForm) return;
    try {
      const res = await axiosInstance.post("/user/register", tempForm);
      if (res.data.success) {
        toast.success("OTP resent to your email");
        setTimeLeft(300);
        setResendDisabled(true);
      }
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  // 5. handle opt verification function
  const handleOTPVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.warning("Enter valid 6-digit OTP");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/user/otp-verify", {
        ...tempForm,
        otp,
      });

      if (data.success) {
        // Save token to localStorage
        login(data.token);
        toast.success(data.message || "Account verified & logged in!");
        console.log("OTP Verified: ", data.user?.name || data);
        navigate("/dashboard"); // Or wherever you want
      }
    } catch (error) {
      console.log("OTP verification failed ", error);
      toast.error(error?.response?.data?.message || "OTP verification failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    // ✅ 1. Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    //email validation
    const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();
    if (!isEmailValid(cleanedEmail)) return;

    // ✅ Check password match
    if (password.length < 6) {
      toast.error("Password length must be atleast 6 character!");
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // ✅ 3. Send only required fields to backend
      const res = await axiosInstance.post("/user/register", {
        name,
        email,
        password,
      });

      console.log("Signup Success:", res);

      // ✅ 4. Check response correctly
      if (res.status === 200 && res.data.success) {
        toast.success("OTP sent to your email");
        // 3. otp verification do not redirect show opt input field
        setShowOTPInput(true);
        setTempForm({ name, email: cleanedEmail, password });

        //reset timer
        setTimeLeft(300);
        setResendDisabled(true);
      } else {
        toast.error("Signup failed. Unexpected response");
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      // ✅ 5. Handle expected errors cleanly
      if (status === 409) {
        toast.error(message || "User already exists");
      } else if (status === 500) {
        toast.error("Server error! Please try again later.");
      } else {
        toast.error("Signup failed. Try again.");
      }
    }
  };

  return (
    <div className="w-full lg:min-h-9/10 h-[90vh] relative flex flex-col justify-center items-center p-5 overflow-hidden">
      {/* 4. otp verification add otp ui */}
      {showOTPInput ? (
        <div className="mt-6 bg-white p-5 rounded shadow">
          <p className="mb-2 text-sm text-gray-700">
            OTP sent to: <strong>{formData.email}</strong>
          </p>

          <p className="text-xs mb-2 text-gray-500">Expires in: {formatTime(timeLeft)}</p>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
          />

          <button
            onClick={handleOTPVerify}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Verify OTP
          </button>

          {!resendDisabled && (
            <button
              onClick={handleResendOTP}
              className="mt-3 text-sm text-indigo-600 underline"
            >
              Resend OTP
            </button>
          )}

          <p
            className="text-xs text-gray-500 mt-2 underline cursor-pointer"
            onClick={() => setShowOTPInput(false)}
          >
            Edit Email
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-lg bg-transparent shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
          />

          <input
            type="text"
            name="email"
            placeholder="Email"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full mb-6 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
          />

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800 transition cursor-pointer"
          >
            Sign Up
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Login
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
