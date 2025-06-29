import axiosInstance from "../api/axiosInstance";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import { useAuth } from "../context/authContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim and normalize email before sending (matches backend)
    const cleanedEmail = email.replace(/\s+/g, "").toLowerCase();

    // Basic validation
    if (!cleanedEmail || !password) {
      return toast.warning("Email and Password are required!");
    }

    if (!validator.isEmail(cleanedEmail)) {
      return toast.warning("Please enter a valid email address!");
    }

    try {
      const { data } = await axiosInstance.post("/user/login", {
        email: cleanedEmail,
        password,
      });

      // Store Token 
      if(data.token){
        localStorage.setItem("authToken", data.token)

        //optional: set axios default header for futire calls
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

      }
      //store token in login
      login(data.token)

      toast.success(data.message || "Logged in successfully!");
      console.log("Login Success:", data.user?.name || data);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error.message);
      const msg = error?.response?.data?.message || "Login failed. Try again!";
      toast.error(msg);
    }
  };

  return (
    <section className="w-full lg:min-h-9/10 h-[90vh] relative flex flex-col justify-center items-center p-5 overflow-hidden">

      <form onSubmit={handleSubmit} autoComplete="off" className="p-8 rounded-lg bg-transparent shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to your Profile</h2>
        <input
          type="text"
          placeholder="Enter you email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        />{" "}
        <br />
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        />{" "}
        <br />
        <button type="submit" className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800 transition">Login</button>
        <p className="text-center mt-4 text-sm">
          Create a new account?{" "}
          <a href="/sign-up" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </section>
  );
}

export default SignIn;
