import React from "react";
import Button from "../components/Button";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className="w-full lg:min-h-9/10 h-[90vh] bg-purple-100 relative flex flex-col justify-center items-center p-5 pr-10 overflow-hidden">
      {/* 💬 Main Content */}
      <h1 className="text-center lg:text-6xl md:text-5xl text-4xl font-bold mb-4">
        ORGANIZE PRIORITIZE ACHIEVE
      </h1>
      <h3 className="text-center text-2xl font-semibold mb-5">
        WELCOME TO TASK MASTER PRO
      </h3>
      <p className="text-center lg:px-20">
        Your personal productivity assistant designed for developers, teams, and
        individuals who want to take control of their daily workflow. With
        powerful features like user authentication, secure task creation, smart
        filtering by status or priority, and seamless performance — Task Master
        Pro helps you stay organized and get things done faster.
      </p>

      <li
        className="mt-6 p-2 px-6 rounded-sm text-white bg-purple-600 list-none"
        // onClick={() => toggleSidebar(false)}
      >
        <NavLink to="/create">Create Your Task</NavLink>
      </li>
    </div>
  );
}

export default Home;
