import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
// import { useAuth } from "../context/authContext";
// import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  // const hasWarned = useRef(false)

  const [priority, setPriority] = useState("medium");
  // const { user, loading } = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if(loading) return
  //   if (!user && !hasWarned) {
  //     toast.warning("You Must Looged in. to create Task");
  //     navigate("/sign-in");
  //     hasWarned.current = true
  //   }
  // }, [user, navigate, loading]); // when user changes it runs
  // if(!user) return null // wait untill user is fetching from localStorage

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
      } else {
        console.log("No response received from backend! ", err.message);
      }
      const msg = err?.response?.data?.message || "Error while creating task!";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full bg-purple-100 lg:min-h-9/10 h-[90vh] relative flex flex-col justify-center items-center p-5 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-lg bg-transparent shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Your Task
        </h2>

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
          className="relative w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        />

        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        >
          <option htmlFor="low">low</option>
          <option htmlFor="medium">medium</option>
          <option htmlFor="high">high</option>
        </select>

        <input
          type="date"
          min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]}
          default={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]}
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
          Add Task
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
