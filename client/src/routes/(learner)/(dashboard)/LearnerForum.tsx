import Sidebar from "@/components/(learner)/Sidebar";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  EllipsisVertical,
  LoaderPinwheel,
  MessageCircle,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function LearnerForumPage() {
  const [isPosting, setIsPosting] = useState(false);

  return (
    <main className="flex flex-row gap-2 min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Sidebar tab="Forum" />
      <div className="flex flex-col gap-4 p-8 w-full max-w-4xl mx-auto">
        <div className="flex flex-row items-center justify-between">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" className="w-md" placeholder="Search" />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
          <div className="flex flex-row gap-2">
            <Bell
              className="shrink-0 grow p-2 bg-white transition-all delay-0 duration-300 hover:bg-gray-100 rounded-full cursor-pointer border border-gray-300"
              size={40}
            />
            <UserCircle
              className="shrink-0 grow p-2 bg-white transition-all delay-0 duration-300 hover:bg-gray-100 rounded-full cursor-pointer border border-gray-300"
              size={40}
            />
          </div>
        </div>
        <fieldset className="fieldset relative">
          <textarea
            className="textarea h-[12rem] resize-none w-full"
            placeholder="Wanna ask something?"
          />
          <div className="flex flex-row gap-4 bottom-10 right-4 absolute">
            <button
              className="btn btn-soft btn-neutral self-end"
              disabled={isPosting}
              onClick={() => {
                setIsPosting(true);
                setTimeout(() => {
                  toast.success("Posted");
                  setIsPosting(false);
                }, 1000);
              }}
            >
              {isPosting ? <LoaderPinwheel className="animate-spin" /> : "Post"}
            </button>
          </div>
          <div className="label cursor-pointer delay-0 duration-300 transition-all hover:text-blue-400">
            Please follow the rules & regulations before posting.
          </div>
        </fieldset>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
              <div className="w-[32px] h-[32px] aspect-square rounded-full bg-gray-200" />
              <p>user123</p>
              <p>/ January 20, 2025</p>
            </div>
            <details className="dropdown dropdown-end">
              <summary className="btn btn-ghost">
                <EllipsisVertical />
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 my-2 shadow-sm">
                <li>
                  <a>Report</a>
                </li>
              </ul>
            </details>
          </div>
          <div className="cursor-pointer transition-all delay-0 duration-300 p-4 rounded-3xl bg-white border border-gray-200 hover:shadow">
            <p className="">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-2 p-4 rounded-3xl bg-white border border-gray-200">
              <ChevronUp className="cursor-pointer delay-0 duration-300 transition-all hover:text-green-500" />
              <p>1</p>
              <ChevronDown className="cursor-pointer delay-0 duration-300 transition-all hover:text-red-500" />
            </div>
            <div className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-white border border-gray-200 cursor-pointer">
              <MessageCircle />
              <p>2</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
