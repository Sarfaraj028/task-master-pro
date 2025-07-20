// src/components/editor/EditorSetup.js
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HighLight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table";
import { TableHeader } from "@tiptap/extension-table";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

export const useTaskEditor = ({ onUpdate }) => {
  return useEditor({
    extensions: [
      StarterKit.configure({
        strike: false,
        underline: false,
        horizontalRule: false,
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        heading: { levels: [1, 2, 3] },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: "flex items-start" },
      }),
      Underline,
      Strike,
      HorizontalRule,
      HighLight,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: ``,
    onUpdate,
  });
};
