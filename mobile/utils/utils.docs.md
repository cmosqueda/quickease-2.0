# `utils` Documentation (Expo SDK 53)

This folder contains reusable utility functions and helpers.

---

## `./utils/axios.ts`

### Overview

Centralized Axios instance for API calls, with built-in authentication checks.

### Exports

- **`checkAuthAndRedirect(): Promise<boolean | null>`**
  - Checks if the current user is authenticated.
  - If valid, fetches user data and updates Zustand `useAuth` state.
  - Returns:
    - `true` if authenticated and user data updated
    - `null` if unauthenticated or invalid response.

- **`_API_INSTANCE`**
  - Axios instance preconfigured with:
    - `baseURL`: `https://quickease-server.onrender.com/api/`
    - `timeout`: 8 minutes
    - `withCredentials`: `true`

### Example Usage

```ts
import API, { checkAuthAndRedirect } from "@/utils/axios";

async function init() {
  const isAuthed = await checkAuthAndRedirect();
  if (!isAuthed) {
    // redirect to login screen
  }
  const { data } = await API.get("/some-protected-route");
}
```

## `./utils/colors.ts`

### Overview

Color utility functions for transforming and generating animation timings.

### Exports

- **`rgbaToHex(rgba: string): string`**  
  Converts `rgba(r,g,b,a)` or `rgb(r,g,b)` strings into HEX (e.g. `#rrggbbaa`).

- **`generateColorsTime(duration: number, colors: string[]): number[]`**  
  Generates evenly distributed time offsets for animations based on color stops.

### Example Usage

```ts
import { rgbaToHex, generateColorsTime } from "@/utils/colors";

const hex = rgbaToHex("rgba(255, 99, 71, 0.5)");
// => "#ff634780"

const steps = generateColorsTime(3000, ["#ff0000", "#00ff00", "#0000ff"]);
// => [3000, 1500, 0]
```

## `./utils/helpers.ts`

### Overview

Helpers for updating `useAuth` Zustand store (notes, quizzes, flashcards).

### Exports

- **`addItem<T>(state, key, item)`**  
  Adds a new item to the specified key (`notes | quizzes | flashcards`).

- **`editItem<T>(state, key, updatedItem)`**  
  Updates an existing item by `id`.

### Example Usage

```ts
import { addItem, editItem } from "@/utils/helpers";

useAuth.setState((state) => {
  addItem(state, "notes", { id: "123", title: "New Note" });
});

useAuth.setState((state) => {
  editItem(state, "notes", { id: "123", title: "Updated Note" });
});
```

# `./utils/quiz.ts`

## Overview

Quiz-related utilities: answer validation, scoring, and timer handling.

## Exports

- **`areAnswersEqual(correct: number[], user: number[]): boolean`**  
  Compares two arrays of answers regardless of order.

- **`calculateScore(userAnswers: any[]): number`**  
  Counts correct answers.

- **`calculateScorePercentage(userAnswers: any[]): number`**  
  Returns percentage score.

- **`handleTimeChange(unit, value, totalSeconds, setTotalSeconds)`**  
  Adjusts time units (`hours | minutes | seconds`).

- **`getUnitValue(unit, totalSeconds): number`**  
  Extracts a specific unit from total seconds.

## Example Usage

```ts
import {
  areAnswersEqual,
  calculateScore,
  calculateScorePercentage,
  handleTimeChange,
  getUnitValue,
} from "@/utils/quiz";

const userAnswers = [
  { question: { correctAnswers: [1, 2] }, user_answer: [2, 1] },
  { question: { correctAnswers: [3] }, user_answer: [3] },
];

calculateScore(userAnswers);
// => 2

calculateScorePercentage(userAnswers);
// => 100
```
