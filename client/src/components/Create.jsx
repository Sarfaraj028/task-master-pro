import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [priority, setPriority] = useState("medium");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, deadline } = formData;

    if (!title) {
      return toast.warning("Title is required!");
    }

    try {
      // const token = localStorage.getItem("authToken")
      const { data } = await axiosInstance.post("/task/create", {
        title,
        description,
        deadline,
        priority,
      });
      const createdTask = data?.task;
      console.log("Task added Successfully! " + createdTask?.title);
      toast.success(title + " Task added Successfully!");
      setFormData({
        title: "",
        description: "",
        deadline: "",
      });
      setPriority("medium");
      return;
    } catch (err) {
      if (err.response) {
        console.log("📦 err.response.status:", err.response.status);
        console.log("📩 err.response.data:", err.response.data);
      }
      else{
        console.log("No response received from backend! ",err.message);        
      }
      const msg = err?.response?.data?.message || "Error while creating task!";
      toast.error(msg);
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
        <h2 className="text-2xl font-bold mb-6 text-center">Add Task</h2>

        {/* {error && <p className="text-red-600 mb-4">{error}</p>} */}

        <input
          type="text"
          name="title"
          placeholder="Enter Task Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        />

        <input
          type="text"
          name="description"
          placeholder="Enter Task Description"
          autoComplete="off"
          value={formData.description}
          onChange={handleChange}
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        />

        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option htmlFor="low">low</option>
          <option htmlFor="medium">medium</option>
          <option htmlFor="high">high</option>
        </select>

        <input
          type="date"
          name="deadline"
          placeholder="Enter Dead Line"
          autoComplete="off"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        />

        {/* add priority + status */}

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
