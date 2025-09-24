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
  "p-2 transition-all duration-300 hover:bg-base-200 rounded-xl cursor-pointer";

type ToolbarAction = {
  Icon: React.ElementType;
  action: (editor: Editor) => void;
  canExecute?: (editor: Editor) => boolean;
  isActive?: (editor: Editor) => boolean;
  label: string;
};

const toolbarItems: ToolbarAction[] = [
  {
    Icon: Bold,
    action: (e) => e.chain().focus().toggleBold().run(),
    canExecute: (e) => e.can().chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive("bold"),
    label: "Bold",
  },
  {
    Icon: Italic,
    action: (e) => e.chain().focus().toggleItalic().run(),
    canExecute: (e) => e.can().chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive("italic"),
    label: "Italic",
  },
  {
    Icon: Strikethrough,
    action: (e) => e.chain().focus().toggleStrike().run(),
    canExecute: (e) => e.can().chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive("strike"),
    label: "Strikethrough",
  },
  {
    Icon: Code,
    action: (e) => e.chain().focus().toggleCode().run(),
    canExecute: (e) => e.can().chain().focus().toggleCode().run(),
    isActive: (e) => e.isActive("code"),
    label: "Inline Code",
  },
  {
    Icon: Quote,
    action: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive("blockquote"),
    label: "Blockquote",
  },
  {
    Icon: Heading1,
    action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (e) => e.isActive("heading", { level: 1 }),
    label: "Heading 1",
  },
  {
    Icon: List,
    action: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive("bulletList"),
    label: "Bullet List",
  },
  {
    Icon: ListOrdered,
    action: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive("orderedList"),
    label: "Ordered List",
  },
  {
    Icon: Code2,
    action: (e) => e.chain().focus().toggleCodeBlock().run(),
    isActive: (e) => e.isActive("codeBlock"),
    label: "Code Block",
  },
  {
    Icon: Minus,
    action: (e) => e.chain().focus().setHorizontalRule().run(),
    label: "Horizontal Rule",
  },
];

type Props = {
  editor: Editor | null;
  style?: string;
  placeholder?: string;
  isToolbarVisible?: boolean;
};

export default function CustomEditor({
  editor,
  style,
  placeholder,
  isToolbarVisible = true,
}: Props) {
  if (!editor) return null;

  return (
    <>
      <div
        className={
          isToolbarVisible
            ? "flex flex-wrap gap-2 p-4 rounded-3xl bg-base-100 border border-base-300 shadow w-fit mb-4"
            : "hidden"
        }
      >
        {toolbarItems.map(
          ({ Icon, action, canExecute, isActive, label }, idx) => {
            const disabled = canExecute ? !canExecute(editor) : false;
            const active = isActive ? isActive(editor) : false;

            return (
              <button
                key={idx}
                type="button"
                title={label}
                aria-label={label}
                disabled={disabled}
                onClick={() => action(editor)}
                className={clsx(
                  iconClass,
                  "flex items-center justify-center",
                  active && "bg-base-300",
                  disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <Icon size={20} />
              </button>
            );
          }
        )}
      </div>

      <EditorContent
        editor={editor}
        placeholder={placeholder}
        className={clsx(
          style,
          "prose bg-base-100 rounded-xl p-4 border border-base-300 focus:outline-none shadow"
        )}
      />
    </>
  );
}
