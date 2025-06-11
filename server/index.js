import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"
import apiRoute from "./routes/apiRoutes.js"
import { connectDB } from "./db/db.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js"

const app = express()
dotenv.config()
connectDB()

const PORT = process.env.SERVER_PORT || 3000

//middlewares 
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//allow this frontend to access the backend
app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend port
  credentials: true
}));

// routes 
app.get("/", (req, res)=>{
    res.send("Home page")
})

//api routes
app.use("/api", apiRoute)

// page not found
app.use((req, res) =>{
    res.status(404).json({message: "Page Not Found 😢"})
})
//global Error handler
app.use(errorMiddleware)

app.listen(PORT, ()=>{
    console.log("App is running on the",PORT);
    
})