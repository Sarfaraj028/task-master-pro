import express from "express";
import testApi from "../controllers/testApi.js";

const apiRoute = express.Router()

apiRoute.get("/test", testApi)
export default apiRoute;
