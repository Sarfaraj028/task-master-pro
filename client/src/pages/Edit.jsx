import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useRef } from "react";
import Heading from "../components/heading";

// tiptap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

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
  const { taskId } = useParams();
  const errorShown = useRef(false);

  // tiptap implementation
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: "flex items-start" },
      }),
    ],
    content: "",
    onUpdate({ editor }) {
      updateStatusFromEditor(editor);
    },
  });

  // 🔄 effect for auth check
  useEffect(() => {
    if (loading) return;
    if (!userToken) {
      toast.warning("You must be logged in to edit tasks");
      navigate("/sign-in");
    }
  }, [loading, userToken, navigate]);

  useEffect(() => {
    if (!taskId || !userToken || loading || !editor) return;

    const fetchTask = async () => {
      try {
        const { data } = await axiosInstance.get(`/task/${taskId}`);
        const { title, description, deadline, priority, status } = data.task;

        setFormData({
          title,
          description: "",
          deadline: deadline ? deadline.split("T")[0] : "",
        });
        setPriority(priority);
        setStatus(status);

        if (description) {
          try {
            const parsed = JSON.parse(description);
            editor.commands.setContent(parsed);
            setTimeout(() => updateStatusFromEditor(editor), 100);
          } catch (parseError) {
            console.log("Description is plain text, not JSON");
            editor.commands.setContent(`<p>${description}</p>`);
          }
        } else {
          editor.commands.clearContent();
        }
      } catch (err) {
        if (!errorShown.current) {
          const msg = err?.response?.data?.message || "Failed to fetch task!";
          toast.error(msg);
          errorShown.current = true;
          navigate("/dashboard");
        }
      }
    };

    fetchTask();
  }, [taskId, userToken, loading, navigate, editor]);

  const updateStatusFromEditor = (editor) => {
    const taskItems = [];
    
    editor.state.doc.descendants(node => {
      if (node.type.name === 'taskItem') {
        taskItems.push(node);
      }
    });

    if (taskItems.length === 0) return;

    const totalTasks = taskItems.length;
    const completedTasks = taskItems.filter(
      node => node.attrs.checked
    ).length;

    let newStatus = "pending";
    if (completedTasks > 0 && completedTasks < totalTasks) {
      newStatus = "in-progress";
    } else if (completedTasks === totalTasks) {
      newStatus = "completed";
    }
    setStatus(newStatus);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, deadline } = formData;
    const description = JSON.stringify(editor.getJSON());

    if (!title) return toast.warning("Title is required!");

    try {
      await axiosInstance.patch(`/task/edit/${taskId}`, {
        title,
        description,
        deadline,
        priority,
        status,
      });
      toast.success(`Task updated successfully!`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed!";
      toast.error(msg);
    }
  };

  if (!userToken) return null;

  return (
    <div className="w-full bg-purple-100 min-h-[90vh] relative flex flex-col items-center md:p-5 p-1 overflow-hidden md:pt-5 pt-5">
      <form
        onSubmit={handleSubmit}
        className="lg:p-8 md:p-3 p-2 lg:pt-3 md:pt-3 pt-3 rounded-lg bg-white shadow-lg w-full max-w-5xl"
      >
        <Heading>Update Your Task</Heading>

        <div className="flex flex-wrap md:flex-nowrap gap-5 float-end mt-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="text-sm mb-4 p-2 pl-0 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>

          <div
            className={`text-sm mb-4 p-2 rounded-md ${
              status === "pending"
                ? "bg-red-300"
                : status === "in-progress"
                ? "bg-orange-300"
                : "bg-green-300"
            }`}
          >
            {status}
          </div>

          <input
            type="date"
            name="deadline"
            min={
              new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            }
            defaultValue={
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
          placeholder="Update Task Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full font-bold text-lg mb-4 pt-3 p-2 pl-0 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
        />

        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Add Checklist
          </button>
        </div>

        <div className="w-full mb-4 p-3 border-1 focus:border-purple-700 border-purple-300 bg-purple-50 outline-0 rounded min-h-[200px]">
          <EditorContent editor={editor} />
        </div>

        <div className="w-full flex justify-between">
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