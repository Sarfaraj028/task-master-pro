import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import apiRoute from "./routes/apiRoutes.js"
import { connectDB } from "./db/db.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
import userRoute from "./routes/userRoute.js"
import docRoutes from './routes/docRoutes.js'
// import { User } from "./models/userModel.js"

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
app.use("/api/user/", userRoute)

//task routes
app.use("/api/task", apiRoute)

//doc routes
app.use("/api/doc", docRoutes)

//global Error handler
app.use(errorMiddleware)

// page not found
app.use((req, res) =>{
    res.status(404).json({message: "Page Not Found 😢"})
})

app.listen(PORT, ()=>{
    console.log("App is running on the",PORT);
    
})

// const email = req.body.email.replace(/\s+/g, '').toLowerCase(); // Removes ALL spaces

// delete all 
// const deleteAllUsers = async () => {
//     await Task.deleteMany({})
//     console.log("All task Deleted!")
// }
// deleteAllUsers()