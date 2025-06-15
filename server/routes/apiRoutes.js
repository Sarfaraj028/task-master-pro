import express from "express";
import testApi from "../controllers/testApi.js";
import { createTask, getTask, deleteTask, deleteAllTasks, updateTask } from "../controllers/taskController.js";
import isAuthenticated from "../middlewares/authMiddleware.js"

const apiRoute = express.Router()

apiRoute.get("/", testApi)
apiRoute.post("/create", isAuthenticated, createTask)
apiRoute.get("/", isAuthenticated, getTask)
apiRoute.delete("/delete/:id", isAuthenticated, deleteTask)
apiRoute.delete("/delete-all", isAuthenticated, deleteAllTasks)
apiRoute.patch("/edit/:id", isAuthenticated, updateTask)

export default apiRoute;
