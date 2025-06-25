import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { toast } from "react-toastify";
import validator from "validator";

//validate email
const commonEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "protonmail.com",
];

const isEmailValid = (email) => {
  if (!validator.isEmail(email)) {
    toast.warning("Please enter a valid email address!");
    return false;
  }

  const domain = email.split("@")[1]?.toLowerCase();

  if (!commonEmailDomains.includes(domain)) {
    toast.warning("Check you email Domain, Did you mean 'gmail.com'?");
    return false;
  }
  return true;
};

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

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
    const cleanedEmail = email.replace(/\s+/g, '').toLowerCase();
    if(!isEmailValid(cleanedEmail)) return

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
        toast.success("Signup successful!");
        setTimeout(() => {
          navigate("/sign-in");
        }, 500);
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
    <div className="w-full lg:min-h-9/10 h-[90vh] relative flex flex-col justify-center items-center p-5 pr-10 overflow-hidden bg-white/50 backdrop-blur-sm">
      {/* 🎨 Animated Blurred Balls */}
      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-purple-700 opacity-40 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-pink-700 opacity-40 rounded-full filter blur-3xl animate-bounce"></div>
      <div className="absolute top-[30%] right-[30%] w-80 h-60 bg-orange-500 opacity-30 rounded-full filter blur-2xl animate-spin-slow"></div>
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-lg bg-transparent shadow-lg w-full max-w-md z-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

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
          className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800 transition"
        >
          Sign Up
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
