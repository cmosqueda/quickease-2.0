/* eslint-disable @typescript-eslint/no-explicit-any */
import _TIPTAP_EXTENSIONS from "@/types/tiptap_extensions";
import clsx from "clsx";
import dayjs from "dayjs";

import { useVote } from "@/hooks/useVote";
import { EditorProvider } from "@tiptap/react";
import { NavLink } from "react-router";
import type { PostAttachment } from "@/types/types";

import {
  Notebook,
  GalleryVertical,
  ChevronUp,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import UserAvatar from "../../UserAvatar";

const AlternatePostCard = ({ data }: { data: any }) => {
  const { mutate: vote } = useVote(["post"]);

  const handlePostVote = (vote_type: number) => {
    vote?.({
      post_id: data?.id,
      vote_type,
    });
  };

  const filteredAttachments = data.attachments.filter(
    (attachment: PostAttachment) => {
      switch (attachment.resource_type) {
        case "NOTE":
          return !!attachment.note_id;
        case "QUIZ":
          return !!attachment.quiz_id;
        case "FLASHCARD":
          return !!attachment.flashcard_id;
        default:
          return false;
      }
    }
  );

  return (
    <>
      <UserAvatar data={data} />
      <h1 className="text-4xl font-bold">{data?.title}</h1>
      {data.tags.length > 0 && (
        <div className="flex flex-row gap-2">
          {data.tags.map((tag: { tag: { tag_name: string } }) => (
            <div key={tag.tag.tag_name} className="badge badge-neutral">
              {tag.tag.tag_name}
            </div>
          ))}
        </div>
      )}
      <div className="p-4 rounded-3xl bg-base-100 shadow border border-base-200">
        <EditorProvider
          content={data?.post_body || ""}
          extensions={_TIPTAP_EXTENSIONS}
          editable={false}
        />
      </div>
      {filteredAttachments.length > 0 && (
        <>
          <h1 className="font-bold text-xl">Attachments</h1>
          <div className="flex flex-row gap-4 items-center">
            {filteredAttachments.map((attachment: PostAttachment) => {
              switch (attachment.resource_type) {
                case "NOTE":
                  return (
                    <NavLink
                      key={attachment.note_id}
                      to={`/learner/note/view/${attachment.note_id}`}
                      className="rounded-xl p-4 bg-base-100 cursor-pointer flex flex-row gap-4 items-center hover:bg-base-300 border border-base-300 shadow"
                    >
                      <Notebook size={24} className="shrink-0" />
                      <h1 className="text-2xl font-bold">
                        {attachment.note?.title}
                      </h1>
                    </NavLink>
                  );
                case "QUIZ":
                  return (
                    <NavLink
                      key={attachment.quiz_id}
                      to={`/learner/quizzes/${attachment.quiz_id}`}
                      className="rounded-xl p-4 bg-base-100 cursor-pointer flex flex-row gap-4 items-center hover:bg-base-300 border border-base-300 shadow"
                    >
                      <GalleryVertical size={24} className="shrink-0" />
                      <h1 className="text-2xl font-bold">
                        {attachment.quiz?.title}
                      </h1>
                    </NavLink>
                  );
                case "FLASHCARD":
                  return (
                    <NavLink
                      key={attachment.flashcard_id}
                      to={`/learner/flashcards/view/${attachment.flashcard_id}`}
                      className="rounded-xl p-4 bg-base-100 cursor-pointer flex flex-row gap-4 items-center hover:bg-base-300 border border-base-300 shadow"
                    >
                      <GalleryVertical size={24} className="shrink-0" />
                      <h1 className="text-2xl font-bold">
                        {attachment.flashcard?.title}
                      </h1>
                    </NavLink>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </>
      )}

      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2 p-4 rounded-3xl bg-base-100 border border-base-300 shadow">
          <ChevronUp
            className={clsx(
              "cursor-pointer hover:text-green-500",
              data?.user_vote === 1 && "text-green-600"
            )}
            onClick={() => handlePostVote(1)}
          />
          <p className="text-sm">{data?.vote_sum ?? 0}</p>
          <ChevronDown
            className={clsx(
              "cursor-pointer hover:text-red-500",
              data?.user_vote === -1 && "text-red-600"
            )}
            onClick={() => handlePostVote(-1)}
          />
        </div>
        <div className="flex flex-row gap-2 py-4 px-6 rounded-3xl bg-base-100 border border-base-300 shadow cursor-pointer transition-all delay-0 duration-300 hover:bg-base-300">
          <MessageCircle />
          <p>{data?.comments?.length ?? 0}</p>
        </div>
      </div>
    </>
  );
};

export default AlternatePostCard;
