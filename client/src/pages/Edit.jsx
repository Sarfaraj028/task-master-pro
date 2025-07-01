import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useRef } from "react";

function Edit() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");

  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { taskId } = useParams(); // 🆔 get taskId from URL
  const errorShown = useRef(false)

  // 🔄 effect for auth check
  useEffect(() => {
    if (loading) return; // wait for loading
    if (!user) {
      toast.warning("You must be logged in to edit tasks");
      navigate("/sign-in");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!taskId || !user || loading) return;

    const fetchTask = async () => {
      try {
        const { data } = await axiosInstance.get(`/task/${taskId}`);
        console.log("data before set " + data.task.status);
        const { title, description, deadline, priority, status } = data.task;
        console.log(taskId);
        console.log(user, loading);
        console.log("data before set" + title);

        setFormData({ title, description: description ? description : "", deadline: deadline ? deadline.split("T")[0] : '' });
        setPriority(priority);
        setStatus(status)
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
  }, [taskId, user, loading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔁 Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, deadline } = formData;

    if (!title) return toast.warning("Title is required!");

    try {
      const { data } = await axiosInstance.put(`/task/edit/${taskId}`, {
        title,
        description,
        deadline,
        priority,
      });

      toast.success(`✅ ${data.task.title} updated successfully!`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed!";
      toast.error(msg);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full bg-purple-100 lg:min-h-9/10 h-[90vh] relative flex flex-col justify-center items-center p-5 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-lg bg-transparent shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Your Task
        </h2>

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

        {/* priority  */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
         {/* status  */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        >
          <option value="in-progress">in-progress</option>
          <option value="pending">pending</option>
          <option value="completed">completed</option>
        </select>

        <input
          type="date"
          name="deadline"
          placeholder="Enter Deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full mb-4 p-3 border-2 focus:border-purple-700 border-purple-400 outline-0 rounded"
        />

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800 transition"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}

export default Edit;
