import React,{ useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // your axios instance

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`/api/users/verify-email/${token}`);
        setStatus(data.message);

        // ✅ Redirect to login after delay
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000); 
      } catch (err) {
        setStatus(
          err.response?.data?.message || "Email verification failed or expired."
        );
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold">{status}</h1>
      {status.includes("successfully") && <p>Redirecting to login...</p>}
    </div>
  );
};

export default VerifyEmail;
