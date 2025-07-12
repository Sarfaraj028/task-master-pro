import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useRef } from "react";
import Heading from "../components/heading";

function Edit() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");

  const { userToken, loading } = useAuth();
  const navigate = useNavigate();
  const { taskId } = useParams(); // 🆔 get taskId from URL
  const errorShown = useRef(false);

  // 🔄 effect for auth check
  useEffect(() => {
    if (loading) return; // wait for loading
    if (!userToken) {
      toast.warning("You must be logged in to edit tasks");
      navigate("/sign-in");
    }
  }, [loading, userToken, navigate]);

  useEffect(() => {
    if (!taskId || !userToken || loading) return;

    const fetchTask = async () => {
      try {
        const { data } = await axiosInstance.get(`/task/${taskId}`);
        console.log("data before set " + data.task.status);
        const { title, description, deadline, priority, status } = data.task;
        console.log(taskId);
        console.log(userToken, loading);
        console.log("data before set" + title);

        setFormData({
          title,
          description: description ? description : "",
          deadline: deadline ? deadline.split("T")[0] : "",
        });
        setPriority(priority);
        setStatus(status);
        console.log("data after set " + title);
        console.log("end of try" + taskId);
      } catch (err) {
        if (!errorShown.current) {
          const msg = err?.response?.data?.message || "Failed to fetch task!";
          toast.error(msg);
          errorShown.current = true; // ✅ Mark as shown
          navigate("/dashboard");
        }
      }
    };

    fetchTask();
  }, [taskId, userToken, loading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔁 Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, deadline } = formData;

    if (!title) return toast.warning("Title is required!");

    try {
      const { data } = await axiosInstance.patch(`/task/edit/${taskId}`, {
        title,
        description,
        deadline,
        priority,
        status,
      });
      console.log("after patch method: " + title);
      toast.success(`Task updated successfully!`);
      navigate("/dashboard");
    } catch (err) {
      console.log("❌ Error updating task:", err);
      console.log("❌ Full error response:", err.response);
      const msg = err?.response?.data?.message || "Update failed!";
      toast.error(msg);
    }
  };

  if (!userToken) return null;

  return (
    <div className="w-full bg-purple-100 min-h-[90vh] relative flex flex-col items-center md:p-5 p-1 overflow-hidden md:pt-5 pt-5">
      <form
        onSubmit={handleSubmit}
        className="lg:p-8 md:p-3 p-2 lg:pt-3 md:pt-3 pt-3  rounded-lg bg-white shadow-lg w-full max-w-5xl"
      >
        <Heading> 
          Update Your Task
        </Heading>

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
          {/* status  */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`text-sm mb-4 p-1 focus:border-purple-700 outline-0  rounded-md ${status === "pending" ? "bg-red-300" : status === "completed" ? "bg-green-300" : "bg-orange-300"}`}
          >
            <option value="in-progress" className="bg-white">in-progress</option>
            <option value="pending" className="bg-white">pending</option>
            <option value="completed" className="bg-white">completed</option>
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

        {/* task title  */}
        <input
          type="text"
          name="title"
          placeholder="Update Task Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full font-bold text-lg mb-4 pt-3 p-2 pl-0 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
        />

        {/* task description  */}
        <textarea
          type="text"
          name="description"
          rows={15}
          placeholder="Start typing description here...."
          autoComplete="off"
          value={formData.description}
          onChange={handleChange}
          className="w-full mb-4 p-3  border-1 focus:border-purple-700 border-purple-300 bg-purple-50 outline-0 rounded"
        > </textarea>
        
        {/* submit button  + Characters count  */}
        <div className="w-full flex justify-between">
          <p>Characters : {formData.description.length}</p>
          <button
            type="submit"
            className="cursor-pointer bg-purple-700 text-white p-3 px-8 rounded hover:bg-purple-800 transition"
          >
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
