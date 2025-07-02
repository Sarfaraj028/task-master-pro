import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NoPage from "./pages/NoPage";
import CreatePost from "./components/Create";
import Signup from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./context/authContext";
import Edit from "./pages/Edit";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />} className="float-end">
              <Route index element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />  } />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/create" element={<ProtectedRoute />}>
                <Route index element={<CreatePost />} />
              </Route>
              <Route path="/edit/:taskId" element={<Edit />} />
              <Route path="/*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
