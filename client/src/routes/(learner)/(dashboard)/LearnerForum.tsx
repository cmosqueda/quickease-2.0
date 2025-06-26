import NotificationsDropdown from "@/components/(learner)/NotificationsDropdown";
import ProfileDropdown from "@/components/(learner)/ProfileDropdown";
import PostCard from "@/components/(learner)/PostCard";
import PostModal from "@/components/(learner)/PostModal";
import _API_INSTANCE from "@/utils/axios";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function LearnerForumPage() {
  const [title, setTitle] = useState("");
  const [html, setHTML] = useState("");

  const editor = useEditor({
    editable: true,
    autofocus: true,
    extensions: _TIPTAP_EXTENSIONS,
    content: "",
    onUpdate: ({ editor }) => {
      setHTML(editor.getHTML());
    },
  });

  const { data } = useInfiniteQuery({
    queryKey: ["recent-posts"],
    queryFn: async ({ pageParam = null }) => {
      const { data: posts } = await _API_INSTANCE.get("/forum/posts/recent", {
        params: { cursor: pageParam, limit: 10 },
      });

      return posts;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? null;
    },
    retry: false,
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-row items-center justify-between gap-8">
        <label className="input w-full lg:w-fit">
          <Search size={24} />
          <input type="search" className="lg:w-md" placeholder="Search" />
        </label>
        <div className="hidden lg:flex flex-row gap-2">
          <button
            className="btn btn-neutral"
            onClick={() => {
              document.getElementById("create-post-modal").showModal();
            }}
          >
            <Plus />
            <p>Create</p>
          </button>
          <NotificationsDropdown />
          <ProfileDropdown />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {data?.pages.flatMap((page) =>
          page.posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
      <PostModal
        editor={editor!}
        html={html}
        setTitle={setTitle}
        title={title}
      />
    </div>
  );
}
