/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from "clsx";
import NoteCard from "../(learner)/NoteCard";
import _API_INSTANCE from "@/utils/axios";
import dayjs from "dayjs";

import {
  ArrowRight,
  LoaderPinwheel,
  Notebook,
  Paperclip,
  SendHorizonal,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import { toast } from "sonner";

const GenerateQuizzesFromNotes = ({
  notes,
  navigate,
}: {
  notes: {
    id: string;
    title: string;
    date: string;
    link: string;
    created_at: string;
  }[];
  navigate: NavigateFunction;
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const handleGenerate = async (id: string) => {
    setIsDisabled(true);

    try {
      const { data } = await _API_INSTANCE.post(
        "/ai/generate-quiz-from-note",
        {
          note_id: id,
        },
        { timeout: 8 * 60 * 1000 }
      );

      await localStorage.setItem(
        "QUICKEASE_GENERATED_CONTENT",
        JSON.stringify(data)
      );

      const modal = document.getElementById(
        "generate-quiz-modal-global"
      ) as HTMLDialogElement;
      
      modal.close();
      return navigate("/learner/quizzes/ai");
    } catch (err) {
      toast.error("Error generating content.");
      throw err;
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 flex-wrap">
      {notes.map((c) => (
        <NoteCard
          key={c.id}
          title={c.title}
          date={c.created_at}
          onClick={() => handleGenerate(c.id)}
          style="bg-base-200 w-full items-start"
          disabled={isDisabled}
        />
      ))}
    </div>
  );
};

const GenerateQuizzesFromPrompt = ({
  navigate,
}: {
  navigate: NavigateFunction;
}) => {
  const [text, setText] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleGenerate = async () => {
    if (!text) {
      toast.error("Invalid input.");
      return;
    }

    setIsDisabled(true);

    try {
      const { data } = await _API_INSTANCE.post(
        "/ai/generate-quiz-from-prompt",
        {
          prompt: text,
        },
        { timeout: 8 * 60 * 1000 }
      );

      await localStorage.setItem(
        "QUICKEASE_GENERATED_CONTENT",
        JSON.stringify(data)
      );

      const modal = document.getElementById(
        "generate-quiz-modal-global"
      ) as HTMLDialogElement;

      modal.close();
      return navigate("/learner/quizzes/ai");
    } catch (err) {
      toast.error("Error generating content.");
      throw err;
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <input
          className="input rounded-3xl w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={isDisabled}>
          {isDisabled ? (
            <LoaderPinwheel
              className="p-2 rounded-full bg-base-100 border border-base-content/30 shrink-0 cursor-not-allowed disabled:bg-base-300 animate-spin"
              size={40}
            />
          ) : (
            <SendHorizonal
              className="p-2 rounded-full bg-base-100 border border-base-content/30 shrink-0 cursor-pointer disabled:bg-base-300"
              size={40}
            />
          )}
        </button>
      </div>
      <p className="hover:text-blue-500 text-xs my-2 cursor-pointer text-base-content/30 transition-all delay-0 duration-300 w-fit">
        Please follow rules & regulations before generating.
      </p>
    </div>
  );
};

const GenerateQuizzesFromPDF = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    const mimeType = file.type;
    let endpoint = "";

    if (
      mimeType.startsWith("application/pdf") ||
      mimeType.includes("document")
    ) {
      endpoint = "ai/generate-quiz-from-pdf";
    } else if (mimeType.startsWith("image/")) {
      endpoint = "ai/upload-image";
    } else {
      return toast.error("File not supported.");
    }

    try {
      setIsGenerating(true);

      const response = await _API_INSTANCE.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10 * 60 * 1000,
      });

      if (response.status === 200) {
        const data = response.data;
        setGeneratedContent(data.content);

        await localStorage.setItem(
          "QUICKEASE_GENERATED_CONTENT",
          JSON.stringify(data)
        );

        const modal = document.getElementById(
          "generate-quiz-modal-global"
        ) as HTMLDialogElement;

        modal.close();
        return navigate("/learner/quizzes/ai");
      } else {
        console.error("Upload failed:", response.data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {file ? (
        <div className="flex flex-row gap-4 p-4 bg-base-200 rounded-3xl items-center">
          <X className="cursor-pointer" onClick={() => setFile(null)} />
          <Notebook />
          <div>
            <h1>{file.name}</h1>
            <p className="text-xs text-base-content/50">
              {dayjs(file.lastModified)
                .format("MMMM DD, YYYY hh:mm A")
                .toString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-base-content/10 border-dashed rounded-lg cursor-pointer bg-base-100 hover:bg-base-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-base-content dark:text-base-content"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-base-content">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-base-content/40">
                DOCX, DOC, PDF, ODF (max 5MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      <button
        className="btn btn-soft btn-success w-fit self-end"
        onClick={handleSubmit}
        disabled={isGenerating}
      >
        <h1>Summarize</h1>
        <ArrowRight />
      </button>
    </>
  );
};

export default function GenerateQuizModal({
  notes,
}: {
  notes: {
    id: string;
    title: string;
    date: string;
    link: string;
    created_at: string;
  }[];
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const tabs = [
    <GenerateQuizzesFromNotes navigate={navigate} notes={notes} />,
    <GenerateQuizzesFromPDF />,
  ];

  return (
    <dialog id="generate-quiz-modal-global" className="modal">
      <div className="modal-box max-w-5xl lg:max-h-[65vh] lg:rounded-3xl rounded-none w-full h-full lg:h-fit flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between">
          <div className="flex flex-row gap-4 items-center">
            <X
              onClick={() => {
                const modal = document.getElementById(
                  "generate-quiz-modal-global"
                ) as HTMLDialogElement;
                modal.close();
              }}
              className="cursor-pointer"
            />
            <h1 className="font-bold text-3xl lg:text-4xl">Generate quiz</h1>
          </div>
          <div role="tablist" className="tabs tabs-box gap-4">
            <a
              role="tab"
              className={clsx(
                "flex flex-row gap-4 tab grow lg:grow-0",
                index == 0 ? "tab-active" : null
              )}
              onClick={() => setIndex(0)}
            >
              <Notebook />
              <h1>Select from notes</h1>
            </a>
            <a
              role="tab"
              className={clsx(
                "flex flex-row gap-4 tab grow lg:grow-0",
                index == 1 ? "tab-active" : null
              )}
              onClick={() => setIndex(1)}
            >
              <Paperclip />
              <h1>Upload document</h1>
            </a>
          </div>
        </div>
        {tabs[index]}
      </div>
    </dialog>
  );
}
