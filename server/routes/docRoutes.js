import express from "express"
import isAuthenticated from "../middlewares/authMiddleware.js"
import { createDoc, getAllDocs, getDocById, updateDoc } from "../controllers/docsController.js"

const router = express.Router()

router.get("/", isAuthenticated, getAllDocs)
router.get("/:id", getDocById)
router.post("/new-doc", isAuthenticated, createDoc)
router.put("/:id", isAuthenticated, updateDoc)

export default router