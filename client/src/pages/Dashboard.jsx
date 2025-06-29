// import React, { useEffect, useState } from "react";
// import TaskCard from "../components/TaskCard";
// import axiosInstance from "../api/axiosInstance";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/authContext";
// import { useNavigate } from "react-router-dom";

// function Dashboard() {
//   const navigate = useNavigate()
//   const [tasks, setTasks] = useState([])
//   const {user} = useAuth()
//   useEffect(()=>{
//     const fetchApi = async() =>{
//       try{
//         const {data} = await axiosInstance.get("/task")
//         setTasks(data.tasks)
//       }catch(err){
//         if(err.response){
//           console.log("Error status ", err.response.status);
//           console.log("Error message ", err.response.data);
//         }
//         else{
//           console.log("No error received from backend! ", err.message);
//         }
//         const msg = err?.response?.data?.message || "Error while fetching tasks!"
//         toast.error(msg)
//       }
//     }; if(!user){
//       toast.warning("Login First"); 
//       navigate("/sign-in")
//       return
//     }else fetchApi()
//   },[user])
//   return (
//     <main className="bg-purple-100">
//       <div className="w-full lg:min-h-9/10 h-[90vh] relative flex flex-col  items-start p-5 md:pr-10 overflow-hidde md:pl-9 pl-3 pr-3">
//         <h2 className="text-3xl font-semibold mb-6">Task Lists</h2>
//         <div className="mb-6">
//           <h3>Priority</h3>
//           <select className="border-b-gray-700 border-2 p-2 px-3">
//             <option value="all">All</option>
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//           <h3>Status</h3>
//           <select className="border-b-gray-700 border-2 ml-2 p-2 px-3">
//             <option value="all">All</option>
//             <option value="pending">Pending</option>
//             <option value="in-progress">In-progress</option>
//             <option value="completed">Completed</option>
//           </select>
//         </div>
//         {/* tasks components  */}
//         {tasks?.length > 0 ? (tasks.map((task) =>{
//           return <TaskCard key={task._id} title={task.title} status={task.status} deadline={task.deadline} />
//         })) : <><p className="mt-4 mx-auto">No Tasks to Show</p></>}
//         {/* <TaskCard title="CSS" status="pending" deadline="30 june, 2025" />
//         <TaskCard title="JavaScript" status="in-progress" deadline="23 june, 2025" /> */}

//       </div>
//     </main>
//   );
// }

// export default Dashboard;


import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");

  // if(loading) return <p>Laoding...</p>
  useEffect(() => {
    
    // if(loading) return
    const fetchApi = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (priority !== "all") queryParams.append("priority", priority);
        if (status !== "all") queryParams.append("status", status);

        const { data } = await axiosInstance.get(`/task?${queryParams.toString()}`);
        setTasks(data.tasks);
      } catch (err) {
        setTasks([])
        const msg = err?.response?.data?.message || "Error while fetching tasks!";
        toast.error(msg);
        console.error("Error while fetching:", err);
      }
    };
    if (!user) {
      toast.warning("Login First");
      navigate("/sign-in");
      return;
    }else{
      fetchApi();
    }
  }, [user, priority, status]); // Runs whenever filter changes

  return (
    <main className="bg-purple-100">
      <div className="w-full lg:min-h-9/10 h-[90vh] relative flex flex-col items-start p-5 md:pr-10 overflow-hidden md:pl-9 pl-3 pr-3">
        <h2 className="text-3xl font-semibold mb-6">Task Lists</h2>

        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Priority</h3>
            <select
              className="border-b-gray-700 border-2 p-2 px-3"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Status</h3>
            <select
              className="border-b-gray-700 border-2 p-2 px-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In-progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Tasks list */}
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              title={task.title}
              status={task.status}
              deadline={task.deadline}
            />
          ))
        ) : (
          <p className="mt-4 mx-auto">No Tasks to Show</p>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
