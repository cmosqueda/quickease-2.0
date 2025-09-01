# 📚 Custom Hooks Documentation

This repository includes a set of React hooks built with **Zustand**, **Immer**, **React Query**, and **AsyncStorage**.  
They provide state management and side-effect handling for authentication, comments, theming, and a Pomodoro-style timer.

---

## 🔑 `useAuth`

Manages **authentication** and user-related data (notes, quizzes, flashcards).

### State & Actions

- `user?: User`
- `setUser(user: User)`
- `addNote(note: Note)`
- `editNote(updatedNote: Partial<Note> & { id: string })`
- `addQuiz(quiz: Quiz)`
- `editQuiz(updatedQuiz: Partial<Quiz> & { id: string })`
- `addFlashcard(flashcard: Flashcard)`
- `editFlashcard(updatedFlashcard: Partial<Flashcard> & { id: string })`

### Persistence

- **Storage key:** `quickease-auth`
- Persists only `user` to **AsyncStorage**.

---

## 💬 `useComment`

Handles **comment creation** for posts and replies using **React Query mutations**.

### API Behavior

- Posts new comments to `/forum/post/comment`.
- Posts replies to `/forum/post/comment/reply`.
- Validates required fields (`body`, `post_id`).
- Calls `checkBadges()` after posting.
- Invalidates specified queries (`default: [["view-post"]]`).
- Displays errors using `sonner-native` toast.

### Type

```ts
type CommentInput = {
  body: string;
  post_id: string;
  parent_comment_id?: string;
};
```

---

## `🎨 useTheme`

Provides **theme switching** across the app.

### State & Actions

- `currentScheme: Theme` — The active theme.
- `setCurrentScheme(theme: keyof typeof _THEMES)` — Update theme by key.

### Defaults

- Default theme: **`rush`**

### Persistence

- **Storage key:** `theme-storage`
- Persists theme selection in **AsyncStorage**.

---

## `⏱ useTimer`

Implements a **Pomodoro timer** with study and break modes.

### Types

```ts
type Mode = "study" | "shortBreak" | "longBreak";

type TimerSettings = {
  study: number;
  shortBreak: number;
  longBreak: number;
};
```

### State & Actions

- `time: number` — Countdown (seconds).
- `isRunning`: boolean
- `mode`: Mode
- `settings`: TimerSettings

### Methods

- `start(), pause(), reset()`
- `tick()` — Decrements time; switches modes when reaching 0.
- `startStudy(), startShortBreak(), startLongBreak()`
- `setDurations(newSettings: TimerSettings)`
- `setSettings(study: number, short_break: number)` — durations in minutes.

### Persistence

- Storage key: `pomodoro-timer`
- Persists `settings`, `time`, and `mode`.

---

## `👍👎 useVote & useVoteOnComment`

Provides functionality for **voting on posts and comments** in the forum.  
Built with **React Query mutations** and **Axios API calls**.

---

## `🔥 useVote`

Handles **post voting**.

### Type

```ts
type VoteInput = { post_id: string; vote_type: number };
```

### Behavior

- Sends a POST request to /forum/post/vote.
- Requires post_id and a numeric vote_type.
- Throws an error if payload is invalid.
- On success:
  - Returns response data.
  - Invalidates specified query keys (default: [["recent-posts"]]).
- On error:
  - Logs the error.
  - Shows toast message with sonner-native.

---

## `💬 useVoteOnComment`

Handles comment voting.

### Type

```ts
type CommentVoteInput = { comment_id: string; vote_type: number };
```

### Behavior

- Sends a POST request to /forum/post/comment/vote.
- Requires comment_id and a numeric vote_type.
- Throws an error if payload is invalid.
- On success:
  - Returns response data.
  - Invalidates specified query keys (default: [["post"]]).
- On error:
  - Logs the error.
  - Shows toast message with sonner-native.
