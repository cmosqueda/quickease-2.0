import NotificationsDropdown from "@/components/(learner)/NotificationsDropdown";
import ProfileDropdown from "@/components/(learner)/ProfileDropdown";
import PostCard from "@/components/(learner)/PostCard";

import { LoaderPinwheel, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LearnerForumPage() {
  const [isPosting, setIsPosting] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-row items-center justify-between gap-8">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
        <div className="hidden lg:flex flex-row gap-2">
          <NotificationsDropdown />
          <ProfileDropdown />
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
      <PostCard />
    </div>
  );
}
