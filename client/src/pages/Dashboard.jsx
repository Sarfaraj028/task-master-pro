import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const {user} = useAuth()
  useEffect(()=>{
    const fetchApi = async() =>{
      try{
        const {data} = await axiosInstance.get("/task")
        setTasks(data.tasks)
      }catch(err){
        if(err.response){
          console.log("Error status ", err.response.status);
          console.log("Error message ", err.response.data);
        }
        else{
          console.log("No error received from backend! ", err.message);
        }
        const msg = err?.response?.data?.message || "Error while fetching tasks!"
        toast.error(msg)
      }
    }; {if(user) fetchApi()}
  },[user])
  return (
    <main>
      <div className="w-full lg:min-h-9/10 h-[90vh] relative flex flex-col  items-start p-5 md:pr-10 overflow-hidden bg-white/50 backdrop-blur-sm md:pl-9 pl-3 pr-3">
        <h2 className="text-3xl font-semibold mb-6">Task Lists</h2>
        <div className="z-10 mb-6">
          <select className="border-b-gray-700 border-2 p-2 px-3">
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select className="border-b-gray-700 border-2 ml-2 p-2 px-3">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In-progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {/* tasks components  */}
        {tasks?.length > 0 ? (tasks.map((task) =>{
          return <TaskCard key={task._id} title={task.title} status={task.status} deadline={task.deadline} />
        })) : <><p className="z-20">No Tasks to Show</p></>}
        {/* <TaskCard title="CSS" status="pending" deadline="30 june, 2025" />
        <TaskCard title="JavaScript" status="in-progress" deadline="23 june, 2025" /> */}

        {/* 🎨 Animated Blurred Balls */}
        <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-purple-700 opacity-40 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-pink-700 opacity-40 rounded-full filter blur-3xl animate-bounce"></div>
        <div className="absolute top-[30%] right-[30%] w-80 h-60 bg-orange-500 opacity-30 rounded-full filter blur-2xl animate-spin-slow"></div>
      </div>
    </main>
  );
}

export default Dashboard;
