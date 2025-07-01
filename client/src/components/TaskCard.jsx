import React from "react";
import { NavLink } from "react-router-dom";

function TaskCard({title, status, deadline, priority, id}) {
  return (
    <div className="w-full flex justify-between items-center p-3 px-4 rounded-md mb-4 shadow-lg bg-white shadow-purple-200">
      <div>
        <h3 className="text-lg">{title}</h3>
        <p className="text-xs">{deadline ? deadline.slice(0, 10) : ""}</p>
      </div>
      <div>
        <span className={` ${status === 'completed' ?" bg-green-300" : status === "in-progress" ? "bg-orange-300" : "bg-red-300" }  p-1 px-3 rounded-md`}>{status}</span>
        {/* task edit button  */}
        <li className="list-none inline">
            <NavLink
              to={`/edit/${id}`}
            >
            <i className="ri-pencil-line text-xl p-4 cursor-pointer"></i>
            </NavLink>
          </li>
        {/* task delete button  */}
        <i className="ri-delete-bin-6-line text-xl cursor-pointer"></i>
      </div>
    </div>
  );
}

export default TaskCard;
