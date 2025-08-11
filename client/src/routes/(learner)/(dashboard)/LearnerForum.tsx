/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificationsDropdown from "@/components/(learner)/NotificationsDropdown";
import ProfileDropdown from "@/components/(learner)/ProfileDropdown";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import _API_INSTANCE from "@/utils/axios";
import useReport from "@/hooks/useReport";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import dayjs from "dayjs";

import {
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  LoaderPinwheel,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { EditorProvider, useEditor } from "@tiptap/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVote } from "@/hooks/useVote";
import { NavLink, useLoaderData, useNavigate } from "react-router";

const Post = ({
  post,
}: {
  post: {
    user_id: string;
    id: string;
    title: string;
    post_body: string;
    created_at: string;
    vote_sum: number;
    user_vote: number;
    user: {
      id: string;
      first_name: string;
      last_name: string;
    };
    tags: {
      tag_id: string;
      post_id: string;
      tag: { id: string; tag_name: string };
    }[];
    comments: { id: string }[];
  };
}) => {
  const { mutate: vote } = useVote();
  const { setPost } = useReport();
  const { user } = useAuth();

  const fullName = `${post?.user?.first_name ?? "Unknown"} ${
    post?.user?.last_name ?? "User"
  }`;

  const formattedDate = dayjs(post.created_at).isValid()
    ? dayjs(post.created_at).format("MMMM DD, YYYY")
    : "Unknown date";

  const handleVote = (vote_type: number) => {
    vote({
      post_id: post.id,
      vote_type,
    });
  };

  const handleShowReport = () => {
    setPost(post);

    const modal = document.getElementById(
      "report-post-modal"
    ) as HTMLDialogElement;

    modal.showModal();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-[32px] h-[32px] rounded-full bg-base-100" />
          <NavLink
            to={`/learner/profile/${post.user.id}`}
            className="font-semibold"
          >
            {fullName}
          </NavLink>
          <p className="text-sm text-gray-500">/ {formattedDate}</p>
        </div>

        {post.user_id != user?.id && (
          <details className="dropdown dropdown-end">
            <summary className="list-none cursor-pointer">
              <EllipsisVertical
                className="rounded-full p-2 border border-base-200"
                size={36}
              />
            </summary>
            <ul className="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-10 w-52 p-2 my-2 shadow-sm">
              <li>
                <button type="button" onClick={handleShowReport}>
                  Report
                </button>
              </li>
            </ul>
          </details>
        )}
      </div>

      {/* Post body */}
      <NavLink
        to={`/learner/post/${post.id}`}
        viewTransition
        className="transition-all duration-300 p-4 rounded-3xl bg-base-100 hover:bg-base-300 border border-base-200 hover:shadow"
      >
        <h1 className="text-3xl font-bold mb-2">{post.title || "Untitled"}</h1>
        <EditorProvider
          content={post.post_body}
          extensions={_TIPTAP_EXTENSIONS}
          editable={false}
        />
        {post.tags.length > 0 && (
          <div className="flex flex-row gap-2 mt-4">
            {post.tags.map((tag) => (
              <div key={tag.tag.tag_name} className="badge badge-neutral">
                {tag.tag.tag_name}
              </div>
            ))}
          </div>
        )}
      </NavLink>

      {/* Footer */}
      <div className="flex flex-row gap-4 mt-2">
        <div className="flex flex-row items-center gap-2 p-3 rounded-3xl bg-base-100 border border-base-200">
          <ChevronUp
            className={clsx(
              "cursor-pointer hover:text-green-500",
              post.user_vote === 1 ? "text-green-600" : ""
            )}
            onClick={() => handleVote(1)}
          />
          <p className="text-sm">{post.vote_sum ?? 0}</p>
          <ChevronDown
            className={clsx(
              "cursor-pointer hover:text-red-500",
              post.user_vote === -1 ? "text-red-600" : ""
            )}
            onClick={() => handleVote(-1)}
          />
        </div>
        <NavLink
          to={`/learner/post/${post.id}`}
          viewTransition
          className="flex flex-row items-center gap-2 px-6 py-3 rounded-3xl bg-base-100 border border-base-200 cursor-pointer hover:bg-base-300 transition"
        >
          <MessageCircle />
          <p className="text-sm">{post.comments?.length ?? 0}</p>
        </NavLink>
      </div>
    </div>
  );
};

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
        <label className="input w-full lg:w-fit">
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
            className="btn btn-neutral"
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
            page.posts.map((post: any) => <Post key={post.id} post={post} />)
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
