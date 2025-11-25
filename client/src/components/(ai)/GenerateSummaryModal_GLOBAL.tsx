/* eslint-disable @typescript-eslint/no-unused-vars */
import _API_INSTANCE from "@/utils/axios";
import clsx from "clsx";
import dayjs from "dayjs";

import { useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import { toast } from "sonner";

import {
  ArrowRight,
  Image,
  LoaderPinwheel,
  Notebook,
  Paperclip,
  X,
} from "lucide-react";

const GenerateFromText = ({
  text,
  isGenerating,
  setText,
  setGeneratedContent,
  setIsGenerating,
  navigate,
}: {
  text: string;
  isGenerating: boolean;
  setText: Dispatch<SetStateAction<string>>;
  setGeneratedContent: Dispatch<SetStateAction<string>>;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;
  navigate: NavigateFunction;
}) => {
  const handleGenerate = async () => {
    if (!text) {
      toast.error("No text.");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, status } = await _API_INSTANCE.post(
        "/ai/generate-notes-from-prompt",
        {
          prompt: text,
        },
        { timeout: 8 * 60 * 1000 }
      );

      if (status == 200) {
        setGeneratedContent(data);
        localStorage.setItem(
          "QUICKEASE_GENERATED_CONTENT",
          JSON.stringify(data)
        );
        const modal = document.getElementById(
          "generate-summary-modal-global"
        ) as HTMLDialogElement;

        modal.close();
        navigate("/learner/note/create/ai", { viewTransition: true });
      }
    } catch (err) {
      toast.error("Error summarizing notes.");
      return;
    } finally {
      setIsGenerating(false);
      setGeneratedContent("");
    }
  };

  return (
    <>
      <textarea
        className="textarea h-[18rem] w-full resize-none"
        placeholder="Notes?"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button
        className="btn btn-soft btn-success w-fit self-end"
        disabled={isGenerating}
        onClick={handleGenerate}
      >
        <h1>Summarize</h1>
        <ArrowRight />
      </button>
    </>
  );
};

export default function GenerateSummaryModal() {
  const navigate = useNavigate();

  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [index, setIndex] = useState(0);
  const [enableAutoGenerate, setIsAutoGenerate] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    const extension = file.name.split(".").pop()?.toLowerCase();
    let endpoint = "";

    const queryParams = `?auto=${enableAutoGenerate}`;

    if (index === 0 && extension === "pdf") {
      endpoint = "ai/generate-notes-from-pdf" + queryParams;
    } else if (
      index === 1 &&
      ["jpg", "jpeg", "png"].includes(extension || "")
    ) {
      endpoint = "ai/generate-notes-from-image" + queryParams;
    } else {
      return toast.error("File not supported or doesn't match selected tab.");
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

        await localStorage.setItem(
          "QUICKEASE_GENERATED_CONTENT",
          JSON.stringify(data)
        );

        setGeneratedContent(data.note.content);

        const modal = document.getElementById(
          "generate-summary-modal-global"
        ) as HTMLDialogElement;

        modal.close();
        return navigate("/learner/note/create/ai", { viewTransition: true });
      } else {
        console.error("Upload failed:", response.data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setGeneratedContent("");
      setFile(null);
      setIndex(0);
      setIsGenerating(false);
    }
  };

  const _TABS = [
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
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          className="toggle"
          checked={enableAutoGenerate}
          onChange={() => setIsAutoGenerate((prev) => !prev)}
        />
        <div className="flex flex-col">
          <h1 className="">Auto-generate flashcards and quiz</h1>
          <p className="text-error text-sm font-medium">
            Note: If the generated note is deleted, it'll also delete the
            generated flashcards and quiz.
          </p>
        </div>
      </div>

      <button
        className="btn btn-neutral w-fit self-end"
        onClick={handleSubmit}
        disabled={isGenerating}
      >
        <h1>Summarize</h1>
        <ArrowRight />
      </button>
    </>,
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
                PNG, JPG, JPEG (max 5MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="image/jpeg, image/jpg"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          className="toggle"
          checked={enableAutoGenerate}
          onChange={() => setIsAutoGenerate((prev) => !prev)}
        />
        <div className="flex flex-col">
          <h1 className="">Auto-generate flashcards and quiz</h1>
          <p className="text-error text-sm font-medium">
            Note: If the generated note is deleted, it'll also delete the
            generated flashcards and quiz.
          </p>
        </div>
      </div>

      <button className="btn btn-neutral w-fit self-end" onClick={handleSubmit}>
        <h1>Summarize</h1>
        <ArrowRight />
      </button>
    </>,
  ];

  if (isGenerating) {
    return (
      <dialog id="generate-summary-modal-global" className="modal">
        <div className="modal-box items-center justify-center flex flex-col gap-4 w-fit">
          <LoaderPinwheel className="animate-spin" size={64} />
          <h3 className="font-bold text-2xl text-center">Generating...</h3>
        </div>
      </dialog>
    );
  }

  return (
    <dialog id="generate-summary-modal-global" className="modal">
      <div className="modal-box max-w-5xl lg:max-h-[65vh] lg:rounded-3xl rounded-none w-full h-full lg:h-fit flex flex-col gap-4">
        {!generatedContent && (
          <div className="flex flex-col lg:flex-row justify-between lg:gap-0 gap-4">
            <div className="flex flex-row gap-4 items-center">
              <X
                onClick={() => {
                  const modal = document.getElementById(
                    "generate-summary-modal-global"
                  ) as HTMLDialogElement;

                  modal.close();
                }}
                className="cursor-pointer"
              />
              <h1 className="font-bold text-3xl lg:text-4xl">
                Generate summary
              </h1>
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
                <Paperclip />
                <h1>Upload document</h1>
              </a>
              <a
                role="tab"
                className={clsx(
                  "flex flex-row gap-4 tab grow lg:flex",
                  index == 1 ? "tab-active" : null
                )}
                onClick={() => setIndex(1)}
              >
                <Image />
                <h1>Upload image</h1>
              </a>
            </div>
          </div>
        )}
        {_TABS[index]}
      </div>
    </dialog>
  );
}
