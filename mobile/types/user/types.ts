// enums
export enum ResolveType {
  IS_DELETED = "IS_DELETED",
  IS_HIDDEN = "IS_HIDDEN",
  NULL = "NULL",
}

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

export enum TokenType {
  CHANGE_EMAIL = "CHANGE_EMAIL",
  RESET_PASSWORD = "RESET_PASSWORD",
  VERIFY_EMAIL = "VERIFY_EMAIL",
}

// models
export interface User {
  id: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  badges?: any;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
  is_admin: boolean;
  is_verified: boolean;

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
  UserToken: UserToken[];
}

export interface Flashcard {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  flashcards: any;
  is_public?: boolean;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean;

  post_attachments: PostAttachment[];
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  notes_content: string;
  is_public?: boolean;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean;

  post_attachments: PostAttachment[];
}

export interface Quiz {
  id: string;
  user_id: string;
  quiz_content: any;
  title: string;
  description?: string;
  is_public?: boolean;
  created_at: Date;
  updated_at: Date;
  is_ai_generated?: boolean;
  is_randomized?: boolean;
  timed_quiz?: number;

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
  title: string;
  post_body: string;
  created_at: Date;
  updated_at: Date;
  is_public: boolean;
  is_resolved?: ResolveType;
  user?: User;
  vote_sum?: number;

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
  parent_comment_id?: string;

  post_id: string;
  user_id: string;
  comment_body: string;
  created_at: Date;
  updated_at: Date;
  user?: User;
  vote_sum?: number;

  parent_comment?: Comment;
  replies: Comment[];
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
  resource_type: ResourceType;
  note_id?: string;
  flashcard_id?: string;
  quiz_id?: string;
  created_at: Date;
  updated_at: Date;

  note?: Note;
  flashcard?: Flashcard;
  quiz?: Quiz;
  post: Post;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  started_at: Date;
  completed_at?: Date;
  answer_data: any;
  is_public: boolean;
  duration: number;
  score: number;

  quiz: Quiz;
  user: User;
}

export interface Report {
  id: string;
  reported_by_id: string;
  reported_post_id?: string;
  reported_comment_id?: string;
  description: string;
  reported_target_type: ReportTargetType;
  reported_at: Date;

  reported_by: User;
  reported_post?: Post;
  reported_comment?: Comment;
}

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: NotificationType;
  resource_id?: string;
  resource_type?: string;
  message: string;
  is_read: boolean;
  created_at: Date;

  recipient: User;
  actor: User;
}

export interface UserToken {
  id: string;
  user_id: string;
  token: string;
  type: TokenType;
  expires_at: Date;
  created_at: Date;
  used: boolean;

  user: User;
}
