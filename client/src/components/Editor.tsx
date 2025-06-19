import clsx from "clsx";

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Quote,
  Heading1,
  List,
  ListOrdered,
  Code2,
  Minus,
} from "lucide-react";
import { Editor, EditorContent } from "@tiptap/react";

const iconClass =
  "shrink-0 p-2 transition-all duration-300 hover:bg-base-200 rounded-xl cursor-pointer";

const toolbarItems = [
  {
    Icon: Bold,
    action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleBold().run(),
    isActive: (editor: Editor) => editor.isActive("bold"),
  },
  {
    Icon: Italic,
    action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleItalic().run(),
    isActive: (editor: Editor) => editor.isActive("italic"),
  },
  {
    Icon: Strikethrough,
    action: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleStrike().run(),
    isActive: (editor: Editor) => editor.isActive("strike"),
  },
  {
    Icon: Code,
    action: (editor: Editor) => editor.chain().focus().toggleCode().run(),
    canExecute: (editor: Editor) =>
      editor.can().chain().focus().toggleCode().run(),
    isActive: (editor: Editor) => editor.isActive("code"),
  },
  {
    Icon: Quote,
    action: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor: Editor) => editor.isActive("blockquote"),
  },
  {
    Icon: Heading1,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor: Editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    Icon: List,
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor: Editor) => editor.isActive("bulletList"),
  },
  {
    Icon: ListOrdered,
    action: (editor: Editor) =>
      editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor: Editor) => editor.isActive("orderedList"),
  },
  {
    Icon: Code2,
    action: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor: Editor) => editor.isActive("codeBlock"),
  },
  {
    Icon: Minus,
    action: (editor: Editor) =>
      editor.chain().focus().setHorizontalRule().run(),
  },
];

const CustomEditor = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2 p-4 rounded-3xl bg-base-100 border border-base-300 w-fit">
        {toolbarItems.map(({ Icon, action, canExecute, isActive }, idx) => {
          const disabled = canExecute ? !canExecute(editor) : false;
          const active = isActive ? isActive(editor) : false;

          return (
            <Icon
              key={idx}
              onClick={() => action(editor)}
              disabled={disabled}
              className={clsx(iconClass, active && "is-active")}
              size={32}
            />
          );
        })}
      </div>

      <EditorContent
        editor={editor}
        className="prose bg-base-100 rounded-xl p-4 outline-hidden border border-base-300"
      />
    </>
  );
};

export default CustomEditor;
