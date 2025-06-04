import clsx from "clsx";
import { ArrowRight, Image, Paperclip, Text } from "lucide-react";
import { useState } from "react";

export default function LearnerSummarizePage() {
  const [tabIndex, setTabIndex] = useState(0);
  const tabs = [
    <>
      <textarea
        className="textarea h-[18rem] w-full resize-none"
        placeholder="Notes?"
      />
      <button className="btn btn-soft btn-success w-fit self-end">
        <h1>Summarize</h1>
        <ArrowRight />
      </button>
    </>,
    <>
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
              <span className="font-semibold">Click to upload</span> or drag and
              drop
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
          />
        </label>
      </div>
      <button className="btn btn-soft btn-success w-fit self-end">
        <h1>Summarize</h1>
        <ArrowRight />
      </button>
    </>,
    <>
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
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-base-content/40">
              PNG, JPG, JPEG (max 5MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/png, image/jpg, image/jpeg"
          />
        </label>
      </div>
      <button className="btn btn-soft btn-success w-fit self-end">
        <h1>Summarize</h1>
        <ArrowRight />
      </button>
    </>,
  ]; // 0 - Input text | 1 - Upload document | 2 - Upload image

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col gap-4 lg:flex-row justify-between items-center">
        <h1 className="font-bold text-3xl lg:text-4xl">Generate summary</h1>
        <div role="tablist" className="tabs tabs-box gap-4">
          <a
            role="tab"
            className={clsx(
              "flex flex-row gap-4 tab grow",
              tabIndex == 0 ? "tab-active" : null
            )}
            onClick={() => setTabIndex(0)}
          >
            <Text />
            <h1>Input text</h1>
          </a>
          <a
            role="tab"
            className={clsx(
              "flex flex-row gap-4 tab grow",
              tabIndex == 1 ? "tab-active" : null
            )}
            onClick={() => setTabIndex(1)}
          >
            <Paperclip />
            <h1>Upload document</h1>
          </a>
          <a
            role="tab"
            className={clsx(
              "flex flex-row gap-4 tab flex-1",
              tabIndex == 2 ? "tab-active" : null
            )}
            onClick={() => setTabIndex(2)}
          >
            <Image />
            <h1>Upload image</h1>
          </a>
        </div>
      </div>
      {tabs[tabIndex]}
    </div>
  );
}
