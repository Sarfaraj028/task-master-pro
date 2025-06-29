import React from "react";

function TaskCard({title, status, deadline, priority}) {
  return (
    <div className="w-full flex justify-between items-center border-1 p-3 px-4 rounded-md mb-4 shadow-lg shadow-purple-200">
      <div>
        <h3 className="text-lg">{title}</h3>
        <p className="text-xs">{deadline ? deadline.slice(0, 10) : ""}</p>
      </div>
      <div>
        <span className={` ${status === 'completed' ?" bg-green-300" : status === "in-progress" ? "bg-orange-300" : "bg-red-300" }  p-1 px-3 rounded-md`}>{status}</span>
        <i className="ri-pencil-line text-xl p-4 cursor-pointer"></i>
        <i className="ri-delete-bin-6-line text-xl cursor-pointer"></i>
      </div>
    </div>
  );
}

export default TaskCard;
