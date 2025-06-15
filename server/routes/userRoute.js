import { getProfile, login, register } from "../controllers/userController.js";
import express from "express"
import isAuthenticated from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", isAuthenticated, getProfile)

export default router