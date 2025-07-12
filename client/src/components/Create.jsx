import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import Heading from "./heading";
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
    <div className="w-full bg-purple-100 min-h-[90vh] relative flex flex-col items-center md:p-5 p-1 overflow-hidden md:pt-5 pt-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white lg:p-8 md:p-3 p-2 lg:pt-3 md:pt-3 pt-3  rounded-lg shadow-lg w-full max-w-5xl"
      >
        {/* h2 Heading  */}
        <Heading>Create Your Task</Heading>

        {/* {error && <p className="text-red-600 mb-4">{error}</p>} */}
        {/* task status, priority, deadline  */}
        <div className="flex flex-wrap md:flex-nowrap gap-5 float-end mt-4">
          {/* priority  */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="text-sm mb-4 p-2 pl-0 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>

          <input
            type="date"
            name="deadline"
            min={
              new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            }
            default={
              new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            }
            placeholder="Enter Deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="text-sm mb-4 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
          />
        </div>
        <input
          type="text"
          name="title"
          placeholder="Add Task Title"
          value={formData.title}
          onChange={handleChange}
          className=" w-full mb-4 font-bold text-lg pt-3 p-2 pl-0 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
        />

        <textarea
          type="text"
          name="description"
          rows={15}
          placeholder="Start typing description here...."
          autoComplete="off"
          value={formData.description}
          onChange={handleChange}
          className="w-full mb-4 p-3  border-1 focus:border-purple-700 border-purple-300 bg-purple-50 outline-0 rounded"
        ></textarea>

        {/* add priority + status */}

        <div className="w-full flex justify-between">
          <p>Characters : {formData.description.length}</p>
          <button
            type="submit"
            className="cursor-pointer bg-purple-700 text-white p-3 px-8 rounded hover:bg-purple-800 transition"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
