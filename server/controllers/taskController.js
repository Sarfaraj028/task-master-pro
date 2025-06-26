import Task from "../models/taskModel.js"
import { asyncHandler, ErrorHandler } from "../utils/asyncHandler.js"

// task post
export const createTask = asyncHandler( async (req, res, next) =>{
    const {title, description, deadline, priority} = req.body;
    if(!title){
        console.error("Title is missing!");
        return next(new ErrorHandler("Title and status is Required", 400))
    }

    const task = await Task.create({
        title,
        description,
        deadline,
        priority,
        user: req.user._id
    })

    console.log("Task Created Successfully!");
    return res.status(201).json({
        success: true,
        message: `Task Created Successfully!`,
        task
    })
} ) 

// get tasks
export const getTask = asyncHandler(async(req, res, next) =>{
    const {status, priority} = req.query;

    const queryObj = { user: req.user._id }

    if(status) queryObj.status = status
    if(priority) queryObj.priority = priority

    console.log(queryObj)
    const tasks = await Task.find(queryObj)

    if(!tasks || tasks.length === 0){
        return next(new ErrorHandler("No Tasks To Show!", 404))
    }

    console.log(`task fetched for user${req.user._id}`);
    return res.status(200).json({
        success: true,
        count: tasks.length,
        message: `All task fetched successfully!`,
        tasks
    })
})

// delete one task
export const deleteTask = asyncHandler(async(req, res, next) =>{

    console.log("Task ID:", req.params.id);
    console.log("User ID:", req.user._id);
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    })

    if(task.deletedCount === 0){
        console.log("No Tasks found To Delete!");
        return next(new ErrorHandler("No Tasks found To Delete!", 404))
    }

    console.log("Deleted task ",task)
    return res.status(201).json({
        success: true,
        message: `Task Deleted Successfully! ${task}`
    })
}) 

// delete all tasks 
export const deleteAllTasks = asyncHandler(async(req, res, next) =>{
    const task = await Task.deleteMany({
        user: req.user._id
    })

    if(task.deletedCount === 0){
        console.log("No Tasks found To Delete!")
        return next(new ErrorHandler("No Tasks found To Delete!", 404))
    }
    console.log("All Tasks Deleted! ")
    return res.status(200).json({
        success: true,
        message: "All Tasks Deleted!"
    })
})

// update task
export const updateTask = asyncHandler(async(req, res, next) =>{

    console.log("Task ID:", req.params.id);
    console.log("User ID:", req.user._id);

    // only these fields are allowed to update 
    const allowedFields = ["title", "description", "status", "deadline", "priority"]
    const updates = {}
    allowedFields.forEach(field =>{
        if(req.body[field] !== undefined){
            updates[field] = req.body[field]
        }
    })
    const task = await Task.findOneAndUpdate(
        {
            _id: req.params.id,
            user: req.user._id,
        },
        updates,
        {
            new: true,
            validator: true
        }
    )

    if(!task){
        console.log("task not found!")
        return next(new ErrorHandler("Task Not Found", 404))
    }

    console.log("Task updated Successfull!", task)
    return res.status(200).json({
        success: true,
        message: `Task Updated Successfully! ${task}`
    })

})