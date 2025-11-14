// components/RichTextEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
// import Table from '@tiptap/extension-table'
// import TableRow from '@tiptap/extension-table-row'
// import TableCell from '@tiptap/extension-table-cell'
// import TableHeader from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table/row'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table/cell'
import { TableHeader } from '@tiptap/extension-table/header'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = 'Начните писать...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none p-4 min-h-[300px] border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Жирный"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Курсив"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Заголовок H2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Маркированный список"
        >
          •••
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Нумерованный список"
        >
          123
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded ${editor.isActive('blockquote') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          title="Цитата"
        >
          &ldquo;
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Введите URL изображения:')
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }}
          className="p-1.5 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 rounded"
          title="Вставить изображение"
        >
          🖼️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-1.5 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 rounded"
          title="Вставить таблицу"
        >
          📊
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
