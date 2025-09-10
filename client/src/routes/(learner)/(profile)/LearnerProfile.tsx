/* eslint-disable @typescript-eslint/no-explicit-any */

import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import clsx from "clsx";
import dayjs from "dayjs";

import { EditorProvider } from "@tiptap/react";
import { Crown, GalleryVertical, Info } from "lucide-react";
import { useState } from "react";
import { NavLink, useLoaderData } from "react-router";

const User = ({ user, posts }: { user: any; posts: any }) => {
  const [index, setIndex] = useState(0);

  const tabs = [
    <>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {user.badges &&
            user.badges.map((badge: any) => {
              const slug = badge.id
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .toLowerCase();
              const imageUrl = `/assets/images/badges/${slug}-gradient.png`;

              return (
                <div
                  key={slug}
                  className="flex flex-row items-center justify-around gap-6 py-4 px-8 bg-base-100 rounded-xl border border-base-300 shadow"
                >
                  <img
                    className="w-24 h-24 rounded-md object-cover"
                    src={imageUrl}
                    alt={badge.id}
                  />
                  <div>
                    <p className="font-bold text-2xl">{badge.name}</p>
                    <p className="text-sm text-base-content/50">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>,
    <>
      <div className="flex flex-col gap-6">
        {posts.map((post: any) => (
          <div className="flex flex-col gap-2" key={post.id}>
            <div className="flex flex-row gap-2 items-center">
              <div className="w-[32px] h-[32px] rounded-full bg-base-100" />
              <h1 className="font-semibold">
                {user?.first_name ?? "Unknown"} {user?.last_name ?? "User"}
              </h1>
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
              className="transition-all duration-300 p-4 rounded-3xl bg-base-100 hover:bg-base-300 border border-base-300 shadow hover:shadow flex flex-col gap-4"
            >
              <EditorProvider
                content={post.post_body}
                editable={false}
                extensions={_TIPTAP_EXTENSIONS}
              />
              {post.is_resolved && (
                <div className="flex flex-row gap-4 p-4 rounded-2xl bg-base-300">
                  <Info />
                  <p>This post has been deleted due to many reports.</p>
                </div>
              )}
            </NavLink>
          </div>
        ))}
      </div>
    </>,
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-row gap-4 bg-base-100 p-8 rounded-3xl items-center border border-base-300 shadow">
          <Crown size={36} />
          <div className="flex flex-col">
            <p>Notes created</p>
            <h1 className="font-bold text-4xl">0</h1>
          </div>
        </div>
        <div className="flex flex-row gap-4 bg-base-100 p-8 rounded-3xl items-center border border-base-300 shadow">
          <GalleryVertical size={36} />
          <div className="flex flex-col">
            <p>Flashcards created</p>
            <h1 className="font-bold text-4xl">0</h1>
          </div>
        </div>
      </div>
    </>,
  ]; // 0 - Badges | 1 - Posts | 2 - Stats

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 lg:p-8 gap-4">
      <div className="bg-base-100 p-8 flex flex-row gap-4 rounded-3xl border-base-300 shadow">
        <img
          src={
            user.avatar
              ? `/assets/images/avatars/${user.avatar}.svg`
              : "/assets/images/avatars/blue.svg"
          }
          className="w-[7rem]"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-sm text-base-content/35">{user?.email}</p>
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
        <a
          role="tab"
          className={clsx("tab", index == 2 ? "tab-active" : null)}
          onClick={() => setIndex(2)}
        >
          Stats
        </a>
      </div>
      {tabs[index]}
    </div>
  );
};

export default function LearnerProfilePage() {
  const data = useLoaderData();

  return <User user={data.user} posts={data.posts} />;
}
