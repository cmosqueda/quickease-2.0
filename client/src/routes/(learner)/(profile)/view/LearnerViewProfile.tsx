/* eslint-disable @typescript-eslint/no-explicit-any */
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import clsx from "clsx";
import UserAvatar from "@/components/(learner)/UserAvatar";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router";
import { EditorProvider } from "@tiptap/react";

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
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const tabs = [
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2">
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
    </div>,
    <>
      {user.posts.map((post: any) => (
        <div className="flex flex-col gap-2">
          <UserAvatar data={post} />
          <h1 className="font-bold text-4xl">{post.title}</h1>
          <NavLink
            to={`/learner/post/${post.id}`}
            viewTransition
            className="transition-all duration-300 p-4 rounded-3xl bg-base-100 hover:bg-base-300 border border-base-300 shadow"
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
      <ArrowLeft
        onClick={() => navigate(-1 as any, { viewTransition: false })}
        className="cursor-pointer"
      />
      <div className="bg-base-100 p-8 flex flex-row gap-4 rounded-3xl border border-base-300 shadow">
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

export default function LearnerViewProfilePage() {
  const data = useLoaderData();

  if (data?.is_public) {
    return <OtherUser user={data} />;
  }

  if (data && !data.is_public) {
    return <OtherUserPrivate user={data} />;
  }
}
