import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useRef } from "react";
import Heading from "../components/H2Heading";

// tiptap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HighLight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table";
import { TableHeader } from "@tiptap/extension-table";
import  Underline  from "@tiptap/extension-underline"
import  Strike  from "@tiptap/extension-strike"
import HorizontalRule from "@tiptap/extension-horizontal-rule";

function Edit() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState(null);
  const [taskItems, setTaskItems] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const { userToken, loading } = useAuth();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const errorShown = useRef(false);
  const setStatusManually = useRef(false);
  const skipEditorStatusSync = useRef(false);

  // tiptap implementation
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        strike: false,
        underline: false,
        horizontalRule: false,
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        heading: { levels: [1, 2, 3] },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: "flex items-start" },
      }),
      Underline,
      Strike,
      HorizontalRule,
      HighLight,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: ``,
    onUpdate({ editor }) {
      updateStatusFromEditor(editor); // ✅ still run every time

      // char count
      const planText = editor.getText();
      setCharCount(planText);
      const words = planText.trim().split(/\s+/g).filter(Boolean).length;
      setWordCount(words);
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
        console.log(editor?.commands)
        if (description) {
          try {
            const parsed = JSON.parse(description);
            skipEditorStatusSync.current = true; // 👈 BLOCK onUpdate temporarily
            editor.commands.setContent(parsed);
            setTimeout(() => {
              skipEditorStatusSync.current = false;

              // ⛑️ force update taskItems so that conditional rendering of status works
              const items = [];
              editor.state.doc.descendants((node) => {
                if (node.type.name === "taskItem") {
                  items.push(node);
                }
              });
              setTaskItems(items); // 👈 important: update state so that UI shows div instead of dropdown
            }, 300);
          } catch (parseError) {
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
    if (skipEditorStatusSync.current) {
      console.log("⏸️ Skipping status update from editor during initial load");
      return;
    }

    const items = [];
    editor.state.doc.descendants((node) => {
      if (node.type.name === "taskItem") {
        items.push(node);
      }
    });

    setTaskItems(items);

    // ✅ if no checkboxes, skip auto update
    if (items.length === 0) {
      console.log("No checkboxes found – not auto updating status");
      return;
    }

    if (setStatusManually.current) {
      console.log("✅ Manual status already set");
      return;
    }

    const total = items.length;
    const completed = items.filter((n) => n.attrs.checked).length;

    let newStatus = "pending";
    if (completed === total && total > 0) newStatus = "completed";
    else if (completed > 0) newStatus = "in-progress";

    console.log("🛠️ Auto-updated status from editor:", newStatus);
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
      setStatusManually.current = false;
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
        <Heading> Your Task </Heading>

        <div className="flex flex-wrap md:flex-nowrap gap-5 bg-purple-50 p-2 rounded-md float-end my-4 ">
          <table className="table-auto">
            <thead>
              <tr className="text-sm font-semibold border-b-2 border-purple-400">
                <td>Priority</td>
                <td>Status</td>
                <td>Deadline</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="text-sm mb-4 mr-2 mt-2 p-2 pl-0 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </td>
                <td>
                  {taskItems.length > 0 ? (
                    <div
                      className={`text-sm mb-4 mr-2 mt-2 p-2 rounded-md ${
                        status === "pending"
                          ? "bg-red-300"
                          : status === "in-progress"
                          ? "bg-orange-300"
                          : "bg-green-300"
                      }`}
                    >
                      {status}
                    </div>
                  ) : (
                    <select
                      value={status || "pending"}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setStatusManually.current = true;
                      }}
                      className={`text-sm mb-4 mr-2 mt-2 p-2 pl-0 cursor-pointer outline-0 rounded-md
                ${
                  status === "pending"
                    ? "bg-red-300"
                    : status === "in-progress"
                    ? "bg-orange-300"
                    : "bg-green-300"
                }
                  `}
                    >
                      <option value="pending" className="bg-white">
                        pending
                      </option>
                      <option value="in-progress" className="bg-white">
                        in-progress
                      </option>
                      <option value="completed" className="bg-white">
                        completed
                      </option>
                    </select>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    name="deadline"
                    min={
                      new Date(
                        Date.now() - new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    placeholder="Enter Deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="inline-block text-sm mb-1 mt-2 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <input
          type="text"
          name="title"
          placeholder="Update Task Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full font-bold text-lg mb-4 pt-3 p-2 pl-0 border-b-2 focus:border-purple-700 border-purple-400 outline-0"
        />

        {/* button to add checkBox */}
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
          {/* h1 Heading  */}
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            H1
          </button>
          {/* h2 Heading  */}
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            H2
          </button>
          {/* h3 Heading  */}
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            H3
          </button>
          {/* text boldness  */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Bold
          </button>
          {/* italic text  */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Italic
          </button>
          {/* BlockQuoted text  */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            BlockQuote
          </button>
          {/* Highlighted text  */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Mark
          </button>
          {/* Bullet Lists  */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            BulletList
          </button>
          {/* Ordered Lists  */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Ordered List
          </button>
          {/* Line through  */}
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="flex items-center text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Strike
          </button>
          {/* Underline  */}
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Underline
          </button>
          {/* Horizontal line  */}
          <button 
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Horizontal line
          </button>
          
          {/* Add Table */}
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Table
          </button>

          {/* Add Row */}
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            + Row
          </button>

          {/* Add Column */}
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            + Col
          </button>

          {/* Delete Table */}
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="text-sm bg-purple-200 hover:bg-purple-300 p-1 px-2 rounded"
          >
            Delete Table
          </button>
        </div>

        {/* <div className="w-full mb-4 p-3 border-1 focus:border-purple-700 border-purple-300 bg-purple-50 outline-0 rounded min-h-[200px]"> */}
        <EditorContent
          editor={editor}
          className="editor-box w-full mb-4 min-h-80 outline-0 bg-purple-50"
        />
        {/* </div> */}

        <div className="w-full flex justify-between">
          <div>
            <p>Characters : {charCount.length}</p>
            <p>Words : {wordCount}</p>
          </div>
          <button
            type="submit"
            className="fixed bottom-2 right-2 lg:right-10 md:right-6 cursor-pointer bg-purple-700 text-white p-2 px-6 rounded hover:bg-purple-800 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
