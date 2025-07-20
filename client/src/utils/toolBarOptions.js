export const toolbarOptions = (editor) => [
  {
    label: "H1",
    action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "H2",
    action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "H3",
    action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Bold",
    action: () => editor.chain().focus().toggleBold().run(),
  },
  {
    label: "Italic",
    action: () => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: "BlockQuote",
    action: () => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    label: "Mark",
    action: () => editor.chain().focus().toggleHighlight().run(),
  },
  {
    label: "BulletList",
    action: () => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Ordered List",
    action: () => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Strike",
    action: () => editor.chain().focus().toggleStrike().run(),
  },
  {
    label: "Underline",
    action: () => editor.chain().focus().toggleUnderline().run(),
  },
  {
    label: "Horizontal Line",
    action: () => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    label: "Table",
    action: () =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    label: "+ Row",
    action: () => editor.chain().focus().addRowAfter().run(),
  },
  {
    label: "+ Col",
    action: () => editor.chain().focus().addColumnAfter().run(),
  },
  {
    label: "Delete Table",
    action: () => editor.chain().focus().deleteTable().run(),
  },
];
