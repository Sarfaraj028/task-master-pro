import express from "express";
import { createTask, getTask, deleteTask, deleteAllTasks, updateTask, getSingleTask } from "../controllers/taskController.js";
import isAuthenticated from "../middlewares/authMiddleware.js"

const apiRoute = express.Router()

apiRoute.post("/create", isAuthenticated, createTask)
apiRoute.get("/", isAuthenticated, getTask)
apiRoute.delete("/delete/:id", isAuthenticated, deleteTask)
apiRoute.delete("/delete-all", isAuthenticated, deleteAllTasks)
apiRoute.get("/:id", isAuthenticated, getSingleTask);
apiRoute.patch("/edit/:id", isAuthenticated, updateTask)

export default apiRoute;
