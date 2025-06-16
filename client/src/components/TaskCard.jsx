import React from "react";
import { useEffect, useState } from 'react'
import API from './api/axiosInstance.js';

function TaskCard() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/api/test")
      .then((res) => {
        console.log("✅ Response from backend:", res.data, " data");
        setData(res.data.message);
        setLoading(false);
      })

      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return( 
    <div>
        <div>TaskCard</div>;
        {loading ? <p>Loading....</p> : <p> {data} </p>}
    </div>
  )
}

export default TaskCard;
