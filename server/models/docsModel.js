import mongoose from "mongoose"

const docsSchema = mongoose.Schema({
    content: {
        type: Object, //tiptap JSON format
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true})

export const Docs = mongoose.model("Docs", docsSchema) 