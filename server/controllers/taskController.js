import Task from "../models/taskModel.js"
import { asyncHandler, ErrorHandler } from "../utils/asyncHandler.js"

// task post
export const createTask = asyncHandler( async (req, res, next) =>{
    const {title, description, status, dueDate, priority} = req.body;
    if(!title || !status){
        console.error("Title and status is missing!");
        return next(new ErrorHandler("Title and status is Required", 400))
    }

    const task = await Task.create({
        title,
        description,
        status,
        dueDate,
        priority,
        user: req.user._id
    })

    console.log("Task Created Successfully!");
    return res.status(201).json({
        success: true,
        message: `Task Created Successfully! ${task}`
    })
} ) 

// task get 
export const getTask = asyncHandler(async(req, res, next) =>{
    const task = await Task.find({user: req.user._id})
    console.log(`task fetched for user${req.user._id}`);
    return res.status(200).json({
        success: true,
        message: `All task fetched successfully! ${task}`
    })
})