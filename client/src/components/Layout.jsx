import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import "./Layout.css";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function Layout() {
  const [isVisible, setIsVisible] = useState(false);
  const { userToken, logout } = useAuth();
  const navigate = useNavigate();

  //handleLogout
  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  const toggleSidebar = (visible) => {
    setIsVisible(visible);
  };
  return (
    <div className="w-full flex bg-purple-100">
      {/* side bar  */}
      <nav
        className={`w-64 bg-purple-200  pt-4 h-screen transition-all duration-500 ease-in-out z-30 lg:fixed
          ${
            isVisible ? "fixed left-0 z-30" : "fixed -left-[380px]"
          } lg:left-0`}
      >
        <li className="list-none text-2xl pl-3 lg:pl-8 mb-5 border-b-2 border-purple-500 pb-3.5">
          {/* task master icon  */}
          <i className="ri-todo-line text-purple-600"></i>{" "}
          <Link to="/" className="font-bold p-2">
            Task Master
          </Link>
          {/* <hr className="mt-4 h[4px]" /> */}
        </li>
        <p
          className=" absolute top-4 right-5 p-1 px-2 text-lg rounded-3xl cursor-pointer hover:bg-purple-600 bg-purple-500 lg:opacity-0 opacity-100 "
          onClick={() => toggleSidebar(false)}
        >
          {/* close icon  */}
          <i className="ri-close-line"></i>
        </p>
        <ul className="z-10">
          <li className="w-full pl-3 lg:pl-8 rounded-sm mb-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "bg-purple-100 w-full block p-1 pr-20" : ""
              }
              onClick={() => toggleSidebar(false)}
            >
              {/* home icon */}
              <i className="ri-home-4-line"></i> Home
            </NavLink>
          </li>
          {userToken && (
            <li
              className="pl-3 lg:pl-8 rounded-sm mb-3"
              onClick={() => toggleSidebar(false)}
            >
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "bg-purple-100 p-1 w-full block pr-20" : ""
                }
              >
                {/* dashboard icon  */}
                <i className="ri-dashboard-2-line"></i> Dashboard{" "}
              </NavLink>
            </li>
          )}
          {userToken && (
            <li
              className="pl-3 lg:pl-8 rounded-sm mb-3"
              onClick={() => toggleSidebar(false)}
            >
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive ? "bg-purple-100 p-1 w-full block pr-20" : ""
                }
              >
                {/* plus icon  */}
                <i className="ri-add-circle-line"></i> Add Task
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      {/* right content top emnu + actual content  */}
      <div className="relative w-full bg-purple-200 transition-all duration-600 ease-in-out">
        {/* top menu */}
        <header className="sticky top-0 w-full bg-purple-200 z-20">
          <div className="flex h-16 justify-between items-center p-2 md:pr-10 pr-3 border-b-purple-600 border-b-2 ">
            {/* navigation show button  */}
            <a className="top-4 my-6 md:ml-6 ml-0">
              {" "}
              {/* opnen nav icon */}
              <i
                className="ri-menu-unfold-fill text-xl font-semibold md:text-3xl lg:opacity-0 opacity-100 text-purple-600 hover:text-purple-800 cursor-pointer"
                onClick={() => toggleSidebar(true)}
              />
            </a>
            <li className="list-none text-xl ml-16 lg:opacity-0 opacity-100 ">
              <Link to="/" className="font-bold ">
                Task Master
              </Link>
            </li>

            {/* login signup button  */}
            {userToken ? (
              <>
                {" "}
                <button
                  onClick={handleLogout}
                  className="p-1 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-4 list-none border-purple-600 border-2 rounded-md lg:p-3 p-1 py-2 lg:pl-5 pl-2">
                <li>
                  <Link to="/sign-in" className="md:text-base text-sm">
                    SignIn
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sign-up"
                    className="bg-purple-600 hover:bg-purple-700 p-2  text-sm md:text-base rounded-md text-white"
                  >
                    SignUp
                  </Link>
                </li>
              </div>
            )}
          </div>
        </header>

        <div className="lg:ml-64 bg-purple-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
