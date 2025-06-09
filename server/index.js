import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import apiRoute from "./routes/apiRoutes.js"

const app = express()
dotenv.config()

const PORT = process.env.SERVER_PORT || 3000

//allow this frontend to access the backend
app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend port
  credentials: true
}));

app.get("/", (req, res)=>{
    res.send("Home page")
})

//api 
app.use("/api", apiRoute)

app.use((req, res) =>{
    res.send("Page Not Found 😢")
})

app.listen(PORT, ()=>{
    console.log("App is running on the",PORT);
    
})