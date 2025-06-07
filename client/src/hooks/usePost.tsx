import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Comment = {
  id: string;
  comment: string;
  upvote: number;
  downvote: number;
  created_at: string | Date;
  updated_at: string | Date;
  post: string; // relational -> post
  user: string; // relational -> user
};

type Post = {
  id: string;
  title: string;
  description: string;
  user: string; // relational -> user
  created_at: string | Date;
  updated_at: string | Date;
};

type PostStore = {
  posts?: Post[];
  createPost: (title: string, description: string) => void;
  updatePost: (id: string, title: string, description: string) => void;
  deletePost: (id: string) => void;
};

const usePost = create<PostStore>()(
  immer((set, get) => ({
    posts: undefined,
    createPost: (title, description) => {},
    updatePost: (id, title, description) => {},
    deletePost: (id) => {},
  }))
);
