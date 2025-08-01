/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Comment {
  id: string;
  comment_body: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  replies: Comment[];
  user_vote: number;
  vote_sum: number;
}

type useReport = {
  post?: {
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
  setPost: (post: any) => void;
  comment?: Comment;
  setComment: (comment: any) => void;
};

const useReport = create<useReport>()(
  immer((set, get) => ({
    post: undefined,
    setPost: (post: any) => {
      set((state) => {
        state.post = post;
      });
    },
    comment: undefined,
    setComment: (comment: any) => {
      set((state) => {
        state.comment = comment;
      });
    },
  }))
);

export default useReport;
