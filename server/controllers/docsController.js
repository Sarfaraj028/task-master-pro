import { Docs } from "../models/docsModel.js";
import { User } from "../models/userModel.js";
import { ErrorHandler, asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// create document
export const createDoc = asyncHandler(async (req, res) => {
  const { content, isPublic = false } = req.body;

  const doc = await Docs.create({
    content,
    isPublic,
    createdBy: req.user._id,
  });

  console.log("Docs created!", doc._id);
  res.status(201).json({
    success: true,
    message: "Document saved!",
    docId: doc._id,
  });
});

// update document
export const updateDoc = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, isPublic } = req.body;

  // find doc
  const doc = await Docs.findById(id);
  if (!doc) throw new ErrorHandler("Document not found!", 404);

  // check ownerShip
  if (doc.createdBy.toString() !== req.user._id.toString()) {
    throw new ErrorHandler("You are not the document owner!", 403);
  }

  // check are these the field sent to the frontend to update
  if (content) doc.content = content;
  if (typeof isPublic === "boolean") doc.isPublic = isPublic;

  await doc.save();

  console.log("Docs updated successfully!", doc._id);
  res.status(200).json({
    success: true,
    message: "Document updated!",
    docId: doc._id,
  });
});

// get document by id
export const getDocById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //find doc
  const doc = await Docs.findById(id);
  if (!doc) throw new ErrorHandler("Document not found!", 404);

  // check document is punlic or private
  let user = null;
  if (!doc.isPublic) {
    //if the doc is not public then authenticate
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded._id).select("_id");
    }

    // check user is owner or not
    const isOwner =
      user && doc.createdBy.toString() === user._id.toString();
    if (!isOwner) {
      throw new ErrorHandler(
        "You are not authorized to view this private document.",
        403
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Document fetched!",
    data: doc,
  });
});

//get all docs
export const getAllDocs = asyncHandler(async (req, res) => {
  const docs = await Docs.find({ createdBy: req.user._id });
  if (docs.length === 0) throw new ErrorHandler("No documents to show!", 404);

  res.status(200).json({
    success: true,
    message: "Document fetched successfully.",
    data: docs,
  });
});

// delete by id 
export const deleteById = asyncHandler (async (req, res)=>{
    const {id} = req.params
    const doc = await Docs.findById(id)
    if(!doc) throw new ErrorHandler("Document not found!", 404)
    
    const isOwner = req.user && doc.createdBy.toString() === req.user._id.toString()
    if(!isOwner){
        throw new ErrorHandler("You are not authorized to delete this document.", 403);
    }

    await Docs.findByIdAndDelete(id)

    console.log("Document deleted successfully.", doc._id)
    res.status(200).json({
        success: true,
        message: "Document deleted successfully.",
    })
})

//delete all 
export const deleteAll = asyncHandler (async (req, res) =>{
    const docs = await Docs.deleteMany({ createdBy: req.user._id })
    if(docs.deletedCount === 0){
        throw new ErrorHandler("No documents found to delete.", 404)
    }
    console.log("All documents deleted successfully.")
    res.status(200).json({
        success: true,
        message: `${docs.deletedCount} documents have been deleted.`,
    })
})
