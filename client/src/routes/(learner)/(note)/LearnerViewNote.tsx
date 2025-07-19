import CustomEditor from "@/components/Editor";
import GenerateFlashcardModal from "@/components/(ai)/GenerateFlashcardModal_NOTE";
import GenerateQuizModal from "@/components/(ai)/GenerateQuizModal_NOTE";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";

import { ArrowLeft, TriangleAlertIcon } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router";
import { useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";

export default function LearnerViewNotePage() {
  const data = useLoaderData();
  const navigate = useNavigate();

  const [html, setHTML] = useState("");
  const [text, setText] = useState("");
  const [json, setJSON] = useState({});
  const [title, setTitle] = useState("");

  const editor = useEditor({
    editable: false,
    autofocus: false,
    extensions: _TIPTAP_EXTENSIONS,
    content: data.notes_content,
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
      setText(editor.getText());
      setJSON(editor.getJSON());
    },
  });

  useEffect(() => {
    setTitle(data.title);
    setHTML(data.notes_content);
  }, [data]);

  useEffect(() => {
    if (editor && editor.isEditable && editor.getText().trim()) {
      setText(editor.getText());
      setJSON(editor.getJSON());
    }
  }, [editor]);

  if (!editor) return;

  if (data.private) {
    return (
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto w-full items-center justify-center gap-4">
        <TriangleAlertIcon size={96} />
        <div>
          <h1 className="text-4xl font-bold text-center">
            The user made this note private.
          </h1>
          <p className="text-base-content/50">
            Sorry, we can't display this note. The user either made this note
            private or made changes on it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:gap-0 gap-4 lg:items-center border-b border-base-300 p-4 bg-base-100">
        <ArrowLeft
          onClick={() =>
            navigate("/learner/library?tab=notes", { viewTransition: true })
          }
          className="cursor-pointer lg:ml-6"
        />
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_0.2fr] h-full">
        <div className="flex flex-col gap-2 p-4 lg:p-8">
          <input
            placeholder="Title..."
            value={title}
            className="font-bold text-3xl input input-ghost w-full"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CustomEditor editor={editor} isToolbarVisible={false} />
        </div>
      </div>
      <GenerateFlashcardModal text={text} />
      <GenerateQuizModal text={text} />
    </div>
  );
}
