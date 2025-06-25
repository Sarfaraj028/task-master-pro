import axiosInstance from '../api/axiosInstance'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import validator from "validator"

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim and normalize email before sending (matches backend)
    const cleanedEmail = email.replace(/\s+/g, '').toLowerCase();

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
    <form onSubmit={handleSubmit} autoComplete='off'>
      <input 
        type='text'
        placeholder='Enter you email'
        name='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete='username'
      /> <br/>
      <input 
        type='password'
        placeholder='Enter your Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete='current-password'
      /> < br />
      <button type='submit'>Login</button>
    </form>
  )
}

export default SignIn