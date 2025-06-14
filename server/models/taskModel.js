import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, "Task title is Required!"]
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"
    },
    deadline: {
        type: Date
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        timestamps: true
    }
)

const Task = mongoose.model("Task", taskSchema)

export default Task