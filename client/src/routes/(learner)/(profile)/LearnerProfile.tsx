/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";

import { ChevronRight, Crown, GalleryVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLoaderData } from "react-router";
import { EditorProvider } from "@tiptap/react";
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import dayjs from "dayjs";

const OtherUserPrivate = ({ user }: { user: any }) => {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="bg-base-100 p-8 flex flex-row gap-4 rounded-3xl">
        <div className="aspect-square items-center">
          <h1 className="font-bold text-4xl p-6 rounded-full bg-base-200 w-fit">
            {user?.first_name[0].toUpperCase()}
            {user?.last_name[0].toUpperCase()}
          </h1>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            {user?.first_name} {user?.last_name}
          </h1>
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-center items-center">
        <h1 className="text-3xl font-bold">This profile is private.</h1>
      </div>
    </div>
  );
};

const OtherUser = ({ user }: { user: any }) => {
  const [index, setIndex] = useState(0);

  const tabs = [
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-bold text-xl">Badges</h1>
          <button className="btn btn-md btn-soft items-center flex flex-row">
            <h1>View all</h1>
            <ChevronRight />
          </button>
        </div>
        <div className="p-8 rounded-3xl bg-base-100"></div>
      </div>
    </>,
    <>
      {user.posts.map((post) => (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <div className="w-[32px] h-[32px] rounded-full bg-base-100" />
            <NavLink
              to={`/learner/profile/${post.user.id}`}
              className="font-semibold"
            >
              {post?.user?.first_name ?? "Unknown"}{" "}
              {post?.user?.last_name ?? "User"}
            </NavLink>
            <p className="text-sm text-gray-500">
              /{" "}
              {dayjs(post.created_at).isValid()
                ? dayjs(post.created_at).format("MMMM DD, YYYY")
                : "Unknown date"}
            </p>
          </div>
          <h1 className="font-bold text-4xl">{post.title}</h1>
          <NavLink
            to={`/learner/post/${post.id}`}
            viewTransition
            className="transition-all duration-300 p-4 rounded-3xl bg-base-100 hover:bg-base-300 border border-base-200 hover:shadow"
          >
            <EditorProvider
              content={post.post_body}
              editable={false}
              extensions={_TIPTAP_EXTENSIONS}
            />
          </NavLink>
        </div>
      ))}
    </>,
  ]; // 0 - Badges | 1 - Posts

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="bg-base-100 p-8 flex flex-row gap-4 rounded-3xl">
        <div className="aspect-square items-center">
          <h1 className="font-bold text-4xl p-6 rounded-full bg-base-200 w-fit">
            {user?.first_name[0].toUpperCase()}
            {user?.last_name[0].toUpperCase()}
          </h1>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            {user?.first_name} {user?.last_name}
          </h1>
        </div>
      </div>
      <div role="tablist" className="tabs tabs-border">
        <a
          role="tab"
          className={clsx("tab", index == 0 ? "tab-active" : null)}
          onClick={() => setIndex(0)}
        >
          Badges
        </a>
        <a
          role="tab"
          className={clsx("tab", index == 1 ? "tab-active" : null)}
          onClick={() => setIndex(1)}
        >
          Posts
        </a>
      </div>
      {tabs[index]}
    </div>
  );
};

const User = ({ user }: { user: any }) => {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="bg-base-100 p-8 flex flex-row gap-4 rounded-3xl">
        <div className="aspect-square items-center">
          <h1 className="font-bold text-4xl p-6 rounded-full bg-base-200 w-fit">
            {user?.first_name[0].toUpperCase()}
            {user?.last_name[0].toUpperCase()}
          </h1>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-sm text-base-content/35">{user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-row gap-4 bg-base-100 p-8 rounded-3xl items-center">
          <Crown size={36} />
          <div className="flex flex-col">
            <p>Notes created</p>
            <h1 className="font-bold text-4xl">0</h1>
          </div>
        </div>
        <div className="flex flex-row gap-4 bg-base-100 p-8 rounded-3xl items-center">
          <GalleryVertical size={36} />
          <div className="flex flex-col">
            <p>Flashcards created</p>
            <h1 className="font-bold text-4xl">0</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-bold text-xl">Badges</h1>
          <button className="btn btn-md btn-soft items-center flex flex-row">
            <h1>View all</h1>
            <ChevronRight />
          </button>
        </div>
        <div className="p-8 rounded-3xl bg-base-100"></div>
      </div>
    </div>
  );
};

export default function LearnerProfilePage() {
  const { user } = useAuth();
  const data = useLoaderData();

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (!data) {
    return <User user={user} />;
  }

  if (data && data.id === user?.id) {
    return <User user={user} />;
  }

  if (data?.is_public) {
    return <OtherUser user={data} />;
  }

  if (data && !data.is_public) {
    return <OtherUserPrivate user={data} />;
  }
}
