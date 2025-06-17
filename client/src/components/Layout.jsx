import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./Layout.css";
import { useState } from "react";

function Layout() {
 const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = (visible) => {
    setIsVisible(visible);
  };
  return (
    <div className="flex">
      {/* side bar  */}
      <nav className={`w-80 bg-purple-200 pl-8 pt-4 h-screen transition-all duration-500 ease-in-out lg:relative 
          ${isVisible ? "absolute left-0 z-10" : "absolute -left-[400px]"} lg:left-0`} >
        <li className="list-none text-2xl mb-5 border-b-2">
          <i className="ri-todo-line text-purple-600"></i>{" "}
          <Link to="/" className="font-bold ">
            Task Master 
          </Link>
          <hr className="mt-4"/>
        </li>
        <p className=" absolute top-6 right-5 p-2 bg-sky-300 lg:opacity-0 opacity-100 "onClick={() => toggleSidebar(false)}>close</p>
        <ul>
          <li className="hover:bg-purple-300 p-2 pl-1 rounded-sm">
            <i className="ri-home-4-line"></i>
            <Link to="/" className=""onClick={() => toggleSidebar(false)}>
              {" "}
              Home
            </Link>
          </li>
          <li className="hover:bg-purple-300 p-2 pl-1 rounded-sm"onClick={() => toggleSidebar(false)}>
            <i className="ri-dashboard-2-line"></i>
            <Link to="/dashboard"> Dashboard </Link>
          </li>
          <li className="hover:bg-purple-300 p-2 pl-1 rounded-sm"onClick={() => toggleSidebar(false)}>
            <Link to='/create' >
              <i className="ri-add-circle-line"></i> Add Task
            </Link>
          </li>
        </ul>
      </nav>
      {/* right content top emnu + actual content  */}
      <div className="w-full transition-all duration-300 ease-in-out">
        {/* top menu */}
        <div className="flex justify-between align-center p-2 pr-10 border-b-purple-600 border-b-2 ">
          <>
            {/* toggle button  */}
            {/* <a className=" fixed top-4 left-6" > <i className="ri-menu-fold-fill text-3xl lg:opacity-0 opacity-100 text-purple-600 hover:text-purple-800 cursor-pointer" /></a> */}
            <p className="p-3"onClick={() => toggleSidebar(true)}>  24 April 2025 </p>
          </>
          
          <div className="flex gap-4 list-none border-purple-600 border-2 rounded-md p-3 pl-5">
            
            <li>
              <Link to="/sign-in">SignIn</Link>
            </li>
            <li>
              <Link to="/sign-up" className="bg-purple-600 hover:bg-purple-700 p-2 px-3 rounded-md text-white">SignUp</Link>
            </li>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
