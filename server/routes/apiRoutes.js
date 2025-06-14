import express from "express";
import testApi from "../controllers/testApi.js";
import { createTask, getTask } from "../controllers/taskController.js";
import isAuthenticated from "../middlewares/userAuthMiddleware.js"

const apiRoute = express.Router()

apiRoute.get("/test", testApi)
apiRoute.post("/task/create", isAuthenticated, createTask)
apiRoute.get("/task/", isAuthenticated, getTask)

export default apiRoute;
