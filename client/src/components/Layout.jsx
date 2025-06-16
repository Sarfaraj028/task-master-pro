import React from "react";
import { Outlet, Link } from "react-router-dom";
import './Layout.css'

function Layout() {
  return (
    <>
      <nav>
        <li>
          <Link to="/">Task Master</Link>
        </li>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard"> Dashboard </Link>
          </li>
          <div>
            <li>
              <Link to="/sign-in">SignIn</Link>
            </li>
            <li>
              <Link to="/sign-up">SignUp</Link>
            </li>
          </div>
        </ul>
      </nav>

      <Outlet />
    </>
  );
}

export default Layout;
