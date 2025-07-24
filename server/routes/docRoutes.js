import express from "express"
import isAuthenticated from "../middlewares/authMiddleware.js"
import { createDoc, deleteAll, deleteById, getAllDocs, getDocById, updateDoc } from "../controllers/docsController.js"

const router = express.Router()

router.get("/", isAuthenticated, getAllDocs)
router.post("/new-doc", isAuthenticated, createDoc)
router.put("/:id", isAuthenticated, updateDoc)
router.delete("/delete-all", isAuthenticated, deleteAll)
router.delete("/:id", isAuthenticated, deleteById)
router.get("/:id", getDocById)

export default router