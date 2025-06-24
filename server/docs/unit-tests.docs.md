**This documents all unit tests executed on jest.**

# Test Framework Setup

**Library Used:** Jest

**Jest Setup & Installation**

To run the tests inside the tests/ folder, you need to install jest library using `npm install --save-dev jest ts-jest @types/jest typescript`

You can now run tests using these scripts:

- `npx jest` for default command, runs all tests, or
- `npx jest [file name]`, example `npx jest auth.service.test.ts` for running test for only one file

You may add `--verbose` like `npx jest --verbose` for detailed output per test.

Learn more at [Jest docs](https://jestjs.io/docs/getting-started)

---

# June 24, 2025

## TL;DR:

<details>
<summary><strong>Summary of Test Results</strong></summary>

- ❌ **Auth Controller**

  - One test failed due to a JWT type mismatch.
  - Root Cause: `jwtSign()` receives a `user.phone_number` that can be `null`, but expects a strict `string`.
  - **Recommendation**: Ensure the token payload excludes or transforms nullable fields appropriately.

- ✅ **User Module**

  - All tests for `user.controller` passed.
  - No issues found in fetching or updating user data.

- ✅ **Note Module**

  - All service and controller tests passed.
  - Note visibility toggling and CRUD operations are stable.

- ✅ **Flashcard Module**

  - All test cases passed.
  - Flashcard creation, updates, and visibility toggling perform as expected.

- ⚠️ **Quiz Controller**

  - 1 out of 7 tests failed.
  - Issue: `create_user_quiz` sends an empty response object `{}`.
  - Root Cause: Missing `await` on `createUserQuiz()` call.
  - **Fix**: Add `await` to properly resolve and return the created quiz.

- ✅ **Quiz Service**

  - All tests passed — handles creation, update, delete, and quiz submission reliably.

- ✅ **Post Module**

  - Service and controller tests passed (22 total).
  - Includes posts, comments, votes, tags, and visibility toggle.

- ❌ **AI Service**

  - 5 out of 6 tests passed.
  - Issue: `generateQuizFromNote` does not return `false` when note isn’t found — returns `undefined` instead.
  - **Fix**: Add explicit `return false` when note is not found.

- ✅ **AI Controller**
  - All controller test cases passed.
  - Properly calls services and returns generated content for quiz, flashcard, and note generation.

</details>

## Auth

### `auth.service.test.ts` - ✅ PASS

✅ All tests passed (5 total)

- ✔ Login with valid credentials
- ✔ Login fails with wrong password
- ✔ Login fails with missing email/password
- ✔ Register hashes password correctly
- ✔ Register creates new user instance

### `auth.controller.test.ts` - ❌ FAIL

❌ 1 test suite failed

- Type mismatch in jwtSign(user) payload, passed user object instead of simplified payload
- user.phone_number is typed as string | null, but jwtSign() requires it to be strictly string, which means it can't be null.

### Next steps:

- debug auth.controller.ts

## User

### `user.controller.test.ts` – ✅ PASS

✅ All tests passed (9 total)

- ✔ get_user returns 200 with user if found
- ✔ get_user returns 404 if user not found
- ✔ get_user returns 500 on service error
- ✔ edit_user_name returns 200 on success
- ✔ edit_user_name returns 400 for invalid input
- ✔ edit_user_name returns 500 on service error
- ✔ toggle_user_visibility returns 200 on success
- ✔ toggle_user_visibility returns 400 for invalid visibility input
- ✔ toggle_user_visibility returns 500 on service error

## Note

### `note.service.test.ts` - ✅ PASS

✅ All tests passed (6 total)

- ✔ getUserNotes should return notes by user ID
- ✔ getUserNote should return single note by ID
- ✔ createUserNote should create and return a note
- ✔ updateUserNote should update and return the note
- ✔ deleteUserNote should delete note and return true
- ✔ toggleNoteVisibility should update is_public and return true

### `note.controller.test.ts` - ✅ PASS

✅ All tests passed (7 total)

- ✔ get_user_notes should return 200 with notes
- ✔ get_user_note should return 200 with single note
- ✔ create_user_note should return 200 with created note
- ✔ update_user_note should return 200 with updated note
- ✔ delete_user_note should return 200 on success
- ✔ toggle_user_note_visibility should return 200 on success
- ✔ create_user_note should return 400 on invalid input

## Flashcard

### `flashcard.service.test.ts` - ✅ PASS

✅ All tests passed (6 total)

- ✔ getUserFlashcards should return flashcards by user ID (7 ms)
- ✔ getUserFlashcard should return a flashcard by ID (1 ms)
- ✔ createUserFlashcard should create and return a flashcard (1 ms)
- ✔ updateUserFlashcard should update and return a flashcard (1 ms)
- ✔ deleteUserFlashcard should delete and return true (1 ms)
- ✔ toggleFlashcardVisibility should update is_public and return true

### `flashcard.controller.test.ts` - ✅ PASS

✅ All tests passed (8 total)

- ✔ get_user_flashcards should return 200 with flashcards (42 ms)
- ✔ get_user_flashcard should return 200 with a flashcard (5 ms)
- ✔ create_user_flashcard should return 200 on valid input (9 ms)
- ✔ create_user_flashcard should return 400 on invalid input (5 ms)
- ✔ update_user_flashcard should return 200 on valid input (6 ms)
- ✔ update_user_flashcard should return 400 on invalid input (4 ms)
- ✔ delete_user_flashcard should return 200 on success (5 ms)
- ✔ toggle_flashcard_visibility should return 200 on success (4 ms)

## Quiz

### `quiz.service.test.ts` - ✅ PASS

✅ All tests passed (7 total)

- ✔ getUserQuizzes should return quizzes by user ID (4 ms)
- ✔ getQuiz should return quiz with attempts (1 ms)
- ✔ createUserQuiz should create and return a quiz (1 ms)
- ✔ updateUserQuiz should update and return quiz (1 ms)
- ✔ updateUserQuizVisibility should update and return quiz (1 ms)
- ✔ deleteUserQuiz should delete quiz and return true (1 ms)
- ✔ submitQuizAttempt should store attempt and return true (1 ms)

### `quiz.controller.test.ts` - ❌ FAIL (6 passed out of 7)

✅ 6 tests passed

- ✔ get_user_quizzes should return 200 with quizzes (27 ms)
- ✔ get_quiz should return 200 with a quiz (1 ms)
- ✔ update_user_quiz should return 200 on success (3 ms)
- ✔ update_user_quiz_visibility should return 200 on success (2 ms)
- ✔ delete_user_quiz should return 200 on success (2 ms)
- ✔ submit_quiz_attempt should return 200 on success (1 ms)

❌ 1 test failed

- × create_user_quiz should return 200 with created quiz (6 ms)
- Reason: Expected response to equal mockQuiz, but received an empty object {}.
- Root Cause: The controller function create_user_quiz did not await the asynchronous createUserQuiz() service call. This resulted in Fastify sending a Promise instead of the resolved quiz object.

### Next Steps:

- Fix: Add await before createUserQuiz(...) in create_user_quiz controller.
- Retest the quiz.controller.test.ts suite to verify all 7 tests pass.

## Post

### `post.service.test.ts` - ✅ PASS

✅ All tests passed (10 total)

- ✔ getUserPosts returns posts (4 ms)
- ✔ getPost returns post with vote summary (1 ms)
- ✔ createPost creates and returns post
- ✔ commentOnPost creates comment and updates post
- ✔ replyOnComment updates comment replies
- ✔ voteOnPost upserts vote (1 ms)
- ✔ voteOnComment upserts vote (1 ms)
- ✔ addTagOnPost upserts tags (1 ms)
- ✔ deletePost deletes the post (1 ms)
- ✔ togglePostVisibility updates post visibility

### `post.controller.test.ts` - ✅ PASS

✅ All tests passed (12 total)

- ✔ get_user_posts returns 200 (26 ms)
- ✔ get_recent_posts returns 200 (1 ms)
- ✔ get_post returns 200 (1 ms)
- ✔ get_comments returns 200 (4 ms)
- ✔ create_post returns 200 (2 ms)
- ✔ comment_on_post returns 200 (3 ms)
- ✔ vote_on_post returns 200 (2 ms)
- ✔ reply_on_comment returns 200 (2 ms)
- ✔ vote_on_comment returns 200 (2 ms)
- ✔ add_tag_on_post returns 200 (2 ms)
- ✔ delete_post returns 200 (1 ms)
- ✔ toggle_post_visibility returns 200 (1 ms)

## AI

### `ai.service.test.ts` - ❌ FAIL (5 passed out of 6)

✅ 5 tests passed

- generateQuizFromNote  
  ✔ should return AI response text when note exists (5 ms)
- generateFlashcardFromNote  
  ✔ should return AI response text for flashcards (1 ms)
- generateQuizFromPrompt  
  ✔ should return AI response text from prompt (1 ms)
- generateFlashcardsFromPrompt  
  ✔ should return AI flashcard string from prompt (1 ms)
- generateNotesFromPrompt  
  ✔ should return generated notes string from prompt (1 ms)

❌ 1 test failed

- × generateQuizFromNote should return false if note not found (3 ms)
- Reason: Expected the function to return false, but it returned undefined.
- Root Cause: The generateQuizFromNote function did not explicitly return false when the note wasn't found.

### `ai.controller.test.ts` - ✅ PASS

✅ All tests passed (5 total)

- ✔ generate_quiz_from_note should return 200 with content (34 ms)
- ✔ generate_flashcards_from_note should return 200 with content (5 ms)
- ✔ generate_quiz_from_prompt should return 200 with content (4 ms)
- ✔ generate_flashcards_from_prompt should return 200 with content (1 ms)
- ✔ generate_notes_from_prompt should return 200 with content (2 ms)

### Next Steps:

- Fix: Add if (!note) return false; inside generateQuizFromNote service function.
- Retest the ai.service.test.ts suite to confirm all 6 tests pass.
