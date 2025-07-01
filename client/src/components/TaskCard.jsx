import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

function TaskCard({ title, status, deadline, priority, id, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    // const confirm = window.confirm("Are you sure You want to delete task")
    // if(!confirm) return
    try {
      await axiosInstance.delete(`/task/delete/${id}`);
      toast.success("Task deletd Successfully!");
      if (onDelete) onDelete(id); // removes task with this id from state instantly
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete task!";
      toast.error(msg);
    }
    setShowModal(false);
  };
  return (
    <div className="w-full flex justify-between items-center p-3 px-4 rounded-md mb-4 shadow-lg bg-white shadow-purple-200 relative">
      <div>
        <h3 className="text-lg">{title}</h3>
        <p className="text-xs">{deadline ? deadline.slice(0, 10) : ""}</p>
      </div>
      <div>
        <span
          className={` ${
            status === "completed"
              ? " bg-green-300"
              : status === "in-progress"
              ? "bg-orange-300"
              : "bg-red-300"
          }  p-1 px-3 rounded-md`}
        >
          {status}
        </span>
        {/* task edit button  */}
        <li className="list-none inline">
          <NavLink to={`/edit/${id}`}>
            <i className="ri-pencil-line text-xl p-4 cursor-pointer"></i>
          </NavLink>
        </li>
        {/* task delete button  */}
        <i
          onClick={() => setShowModal(true)}
          className="ri-delete-bin-6-line text-xl cursor-pointer"
        ></i>
      </div>
      {/* delete modal  */}
      {showModal && (
        <ConfirmModal
          message="Are you sure, You Wanna delete the Task!"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default TaskCard;
