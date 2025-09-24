/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificationsDropdown from "@/components/(learner)/forum/NotificationsDropdown";
import ProfileDropdown from "@/components/(learner)/forum/ProfileDropdown";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import ForumPostCard from "@/components/(learner)/forum/ForumPostCard";

import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate } from "react-router";

import { LoaderPinwheel, Plus, Search } from "lucide-react";
import UserAvatar from "@/components/(learner)/UserAvatar";

export default function LearnerForumPage() {
  const navigate = useNavigate();
  const notifications = useLoaderData();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const editor = useEditor({
    editable: true,
    autofocus: true,
    extensions: _TIPTAP_EXTENSIONS,
    content: "",
  });

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["recent-posts"],
      queryFn: async ({ pageParam = null }) => {
        const { data: posts } = await _API_INSTANCE.get("/forum/posts/recent", {
          params: { cursor: pageParam, limit: 6 },
          timeout: 5 * 60 * 1000,
        });
        return posts;
      },
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
      retry: 3,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    return () => editor?.destroy();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-row items-center justify-between gap-8">
        <label className="input w-full lg:w-fit border-base-300">
          <Search size={24} />
          <input
            type="search"
            className="lg:w-md"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                navigate(`/learner/search/${query}`);
              }
            }}
          />
        </label>
        <div className="hidden lg:flex flex-row gap-2">
          <button
            onClick={() => {
              navigate("/learner/post/");
            }}
            className="btn btn-neutral mx-2"
            disabled={!user?.is_verified}
          >
            <Plus />
            <div className="flex flex-col items-start">
              {user?.is_verified && <p>Create</p>}
              {!user?.is_verified && <p>Email not verified</p>}
            </div>
          </button>
          {user?.is_verified && (
            <NotificationsDropdown notifications={notifications} />
          )}
          <ProfileDropdown />
        </div>
      </div>
      {isFetching && !isFetchingNextPage ? (
        <div className="max-w-7xl h-full w-full mx-auto flex items-center justify-center">
          <LoaderPinwheel className="animate-spin" size={128} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data?.pages.flatMap((page) =>
            page.posts.map((post: any) => (
              <ForumPostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <LoaderPinwheel className="animate-spin" size={48} />
        </div>
      )}
    </div>
  );
}
