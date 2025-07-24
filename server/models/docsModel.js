import mongoose from "mongoose"

const docsSchema = mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Document"
    },
    content: {
        type: Object, //tiptap JSON format
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true})

export const Docs = mongoose.model("Docs", docsSchema) 