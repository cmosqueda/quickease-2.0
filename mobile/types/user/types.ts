export enum ResourceType {
  NOTE = "NOTE",
  QUIZ = "QUIZ",
  FLASHCARD = "FLASHCARD",
}

export enum ReportTargetType {
  POST = "POST",
  COMMENT = "COMMENT",
}

export enum NotificationType {
  COMMENTED = "COMMENTED",
  REPLIED = "REPLIED",
  OBTAINED_BADGE = "OBTAINED_BADGE",
  CHANGED_NAME = "CHANGED_NAME",
  CHANGED_EMAIL = "CHANGED_EMAIL",
  CHANGED_PASSWORD = "CHANGED_PASSWORD",
  REPORTED = "REPORTED",
  DELETED_POST_BY_REPORT = "DELETED_POST_BY_REPORT",
  DELETED_COMMENT_BY_REPORT = "DELETED_COMMENT_BY_REPORT",
}

export interface User {
  id: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string | null;
  phone_number?: string | null;
  badges?: any;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
  is_admin: boolean;

  flashcards: Flashcard[];
  notes: Note[];
  quizzes: Quiz[];
  posts: Post[];
  comments: Comment[];
  postVotes: PostVote[];
  commentVotes: CommentVote[];
  quizAttempts: QuizAttempt[];
  forumReports: Report[];
  notifications_received: Notification[];
  notifications_sent: Notification[];
}

export interface Flashcard {
  id: string;
  user_id: string;
  user: User;
  title: string;
  description?: string | null;
  flashcards: any;
  is_public?: boolean | null;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean | null;

  post_attachments: PostAttachment[];
}

export interface Note {
  id: string;
  user_id: string;
  user: User;
  title: string;
  notes_content: string;
  is_public?: boolean | null;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean | null;

  post_attachments: PostAttachment[];
}

export interface Quiz {
  id: string;
  user_id: string;
  user: User;
  quiz_content: any;
  title: string;
  description?: string | null;
  is_public?: boolean | null;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean | null;
  is_randomized?: boolean | null;
  timed_quiz?: string | null;

  post_attachments: PostAttachment[];
  attempts: QuizAttempt[];
}

export interface Tag {
  id: string;
  tag_name: string;
  created_at: Date;

  posts: PostTag[];
}

export interface Post {
  id: string;
  user_id: string;
  user: User;
  title: string;
  post_body: string;
  created_at: Date;
  updated_at: Date;
  is_public: boolean;

  tags: PostTag[];
  comments: Comment[];
  votes: PostVote[];
  attachments: PostAttachment[];
  reports: Report[];
}

export interface PostTag {
  tag_id: string;
  post_id: string;
  tag: Tag;
  post: Post;
}

export interface Comment {
  id: string;
  parent_comment_id?: string | null;
  parent_comment?: Comment | null;
  replies: Comment[];

  post_id: string;
  post: Post;
  user_id: string;
  user: User;
  comment_body: string;
  created_at: Date;
  updated_at: Date;

  votes: CommentVote[];
  reports: Report[];
}

export interface PostVote {
  user_id: string;
  post_id: string;
  vote_type: number;
  user: User;
  post: Post;
}

export interface CommentVote {
  user_id: string;
  comment_id: string;
  vote_type: number;
  user: User;
  comment: Comment;
}

export interface PostAttachment {
  id: string;
  post_id: string;
  post: Post;

  resource_type: ResourceType;

  note_id?: string | null;
  flashcard_id?: string | null;
  quiz_id?: string | null;

  note?: Note | null;
  flashcard?: Flashcard | null;
  quiz?: Quiz | null;

  created_at: Date;
  updated_at: Date;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  quiz: Quiz;
  user_id: string;
  user: User;
  started_at: Date;
  completed_at?: Date | null;
  answer_data: any;
  is_public: boolean;
  duration: number;
  score: number;
}

export interface Report {
  id: string;
  reported_by_id: string;
  reported_by: User;

  reported_post_id?: string | null;
  reported_post?: Post | null;

  reported_comment_id?: string | null;
  reported_comment?: Comment | null;

  description: string;
  reported_target_type: ReportTargetType;
  reported_at: Date;
}

export interface Notification {
  id: string;
  recipient_id: string;
  recipient: User;
  actor_id: string;
  actor: User;
  type: NotificationType;
  resource_id?: string | null;
  resource_type?: string | null;
  message: string;
  is_read: boolean;
  created_at: Date;
}
