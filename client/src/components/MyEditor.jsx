import React from 'react'

//step 1: tiptap
import {useEditor, EditorContent} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"

//step 2: tiptap
function MyEditor() {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false, // important: disable default list to use task list
            }),
            TaskList,
            TaskItem.configure({
                nested: true
            })
        ],
        content: 
            `<p>Today's Plan: </p>
            <ul data-type="taskList"> 
                <li data-checked="true"> <p> Array Done </p> </li>
                <li data-checked="false"> <p> Linked List </p> </li>
                <li data-checked="false"> <p> Stack </p> </li>
            </ul>
        `,
        onUpdate({editor}) {
            const json = editor.getJSON()
            console.log("📈 JSON Output ", json)
        }
    })
    if(!editor) return null
  return (
    <div className="border p-4 rounded shadow-sm max-w-xl mx-auto mt-6">
        <EditorContent editor={editor} />
        <button onClick={()=>{
            const html = editor.getHTML()
            const json = editor.getJSON()
            console.log("💾 Save to DB ➡️", { html, json })
        //   call your backend API here (axios.post etc.)
        }} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Save
        </button>
    </div>
  )
}

export default MyEditor