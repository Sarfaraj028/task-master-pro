import React, { useEffect, useState, useRef } from "react";
import TaskCard from "../components/TaskCard";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [openTaskWithId, setOpenTaskWithId] = useState(null)

  const shownError = useRef(false)
  const navigate = useNavigate();
  const { userToken, loading, user } = useAuth();


  // function to delete Single task from the state
  function handleDeletedTask(deletedId) {
    setTasks((keepTasks) => keepTasks.filter((task) => task._id !== deletedId));
  }

  //delete all tasks
  async function deleteAll() {
    if(tasks.length === 0){
      console.log("No Tasks to Delete!");
      toast.info("No Tasks to Delete!")
      setShowModal(false)
      return
    }
    try{
      await axiosInstance.delete("/task/delete-all")
      setTasks([]);
      setShowModal(false)
      toast.success("All Tasks Deleted Successfully!")
    }
    catch(err){
      console.log("ERROR : "+err?.data?.response.message || "Failed to delete tasks!" )
      setShowModal(false)
      toast.error("Error while deleting tasks!")
    }
  }

  useEffect(() => { 
    if (loading) return;
    const fetchApi = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (priority !== "all") queryParams.append("priority", priority);
        if (status !== "all") queryParams.append("status", status);

        const { data } = await axiosInstance.get(
          `/task?${queryParams.toString()}`
        );
        setTasks(data.tasks);
      } catch (err) {
        const msg =
          err?.response?.data?.message || "Error while fetching tasks!";
          setTasks([]);
        if(shownError.current === false){
          toast.error(msg);
          console.error("Error while fetching:", err);
          shownError.current = true 
        }
      }
    };
    if (!userToken) {
      toast.warning("You Must Logged in to Access Dashboard!");
      navigate("/sign-in");
      return;
    } else {
      fetchApi();
    }
  }, [loading, userToken, priority, status]); // Runs whenever filter changes

  return (
    <main className="bg-purple-100 min-h-[90vh]">
      <div className="w-full lg:min-h-[90vh] relative flex flex-col items-start p-5 md:pr-10 overflow-hidden md:pl-9 pl-3 pr-3">
        {/* User  */}
          <div className="w-full flex flex-col items-end">
            <p className="uppercase text-3xl font-semibold bg-purple-500 text-white p-2 px-4 rounded-4xl">
              {user?.name?.slice(0, 1)}
            </p>
            <p className="">{user.email}</p> 
          </div>
        <div className="w-full flex justify-between items-center pb-6 pt-2">
          <h2 className="text-3xl font-semibold ">Task Lists</h2>
          {tasks.length > 0 && <p
            onClick={() => setShowModal(true)}
            className="text-red-600 font-semibold border-1 border-red-300 py-1 px-2 rounded-md hover:bg-red-600 transition ease-in-out duration-200 cursor-pointer hover:text-white"
          >
            Delete All
          </p>}
        </div>
        {/* delete modal  */}
        {showModal && (
          <ConfirmModal
            message="Are you sure, All Tasks will be deleted!"
            onConfirm={deleteAll}
            onCancel={() => setShowModal(false)}
          />
        )}

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
              id={task._id}
              title={task.title}
              description={task.description}
              status={task.status}
              deadline={task.deadline}
              priority={task.priority}
              onDelete={handleDeletedTask}
              openTaskWithId={openTaskWithId}
              setOpenTaskWithId={setOpenTaskWithId}
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
