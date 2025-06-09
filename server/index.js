import express from "express"

const app = express()

app.get("/", (req, res)=>{
    res.send("Home page")
})

app.use((req, res) =>{
    res.send("Page Not Found 😢")
})

app.listen(3000, ()=>{
    console.log("App is running on the 3000");
    
})