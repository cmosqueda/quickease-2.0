**This documents all unit tests executed on jest.**

# Test Framework Setup

**Library Used:** Jest

**Jest Setup & Installation**

To run the tests inside the tests/ folder, you need to install jest library using `npm install --save-dev jest ts-jest @types/jest typescript`

You can now run tests using these scripts:

- `npx jest` for default command, runs all tests, or
- `npx jest [file name]`, example `npx jest auth.service.test.ts` for running test for only one file

You may add `--verbose` like `npx jest --verbose` for detailed output per test.

Or run these custom scripts defined at package.json:

- `npm test` or `npm run test`
- `npm run test:verbose` for detailed tests

Learn more at [Jest docs](https://jestjs.io/docs/getting-started)

---

# June 24, 2025

<details>
<summary><strong>TL;DR</strong></summary>

## SUMMARY

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

<details>
<summary><strong>FULL REPORT</strong></summary>

## AUTH

### `auth.service.test.ts` - ✅ PASS

✅ All tests passed (5 total)

- Login with valid credentials
- Login fails with wrong password
- Login fails with missing email/password
- Register hashes password correctly
- Register creates new user instance

### `auth.controller.test.ts` - ❌ FAIL

❌ 1 test suite failed

- Type mismatch in jwtSign(user) payload, passed user object instead of simplified payload
- user.phone_number is typed as string | null, but jwtSign() requires it to be strictly string, which means it can't be null.

### Next steps:

- debug auth.controller.ts

## USER

### `user.controller.test.ts` – ✅ PASS

✅ All tests passed (9 total)

- get_user returns 200 with user if found
- get_user returns 404 if user not found
- get_user returns 500 on service error
- edit_user_name returns 200 on success
- edit_user_name returns 400 for invalid input
- edit_user_name returns 500 on service error
- toggle_user_visibility returns 200 on success
- toggle_user_visibility returns 400 for invalid visibility input
- toggle_user_visibility returns 500 on service error

## NOTE

### `note.service.test.ts` - ✅ PASS

✅ All tests passed (6 total)

- getUserNotes should return notes by user ID
- getUserNote should return single note by ID
- createUserNote should create and return a note
- updateUserNote should update and return the note
- deleteUserNote should delete note and return true
- toggleNoteVisibility should update is_public and return true

### `note.controller.test.ts` - ✅ PASS

✅ All tests passed (7 total)

- get_user_notes should return 200 with notes
- get_user_note should return 200 with single note
- create_user_note should return 200 with created note
- update_user_note should return 200 with updated note
- delete_user_note should return 200 on success
- toggle_user_note_visibility should return 200 on success
- create_user_note should return 400 on invalid input

## FLASHCARD

### `flashcard.service.test.ts` - ✅ PASS

✅ All tests passed (6 total)

- getUserFlashcards should return flashcards by user ID (7 ms)
- getUserFlashcard should return a flashcard by ID (1 ms)
- createUserFlashcard should create and return a flashcard (1 ms)
- updateUserFlashcard should update and return a flashcard (1 ms)
- deleteUserFlashcard should delete and return true (1 ms)
- toggleFlashcardVisibility should update is_public and return true

### `flashcard.controller.test.ts` - ✅ PASS

✅ All tests passed (8 total)

- get_user_flashcards should return 200 with flashcards (42 ms)
- get_user_flashcard should return 200 with a flashcard (5 ms)
- create_user_flashcard should return 200 on valid input (9 ms)
- create_user_flashcard should return 400 on invalid input (5 ms)
- update_user_flashcard should return 200 on valid input (6 ms)
- update_user_flashcard should return 400 on invalid input (4 ms)
- delete_user_flashcard should return 200 on success (5 ms)
- toggle_flashcard_visibility should return 200 on success (4 ms)

## QUIZ

### `quiz.service.test.ts` - ✅ PASS

✅ All tests passed (7 total)

- getUserQuizzes should return quizzes by user ID (4 ms)
- getQuiz should return quiz with attempts (1 ms)
- createUserQuiz should create and return a quiz (1 ms)
- updateUserQuiz should update and return quiz (1 ms)
- updateUserQuizVisibility should update and return quiz (1 ms)
- deleteUserQuiz should delete quiz and return true (1 ms)
- submitQuizAttempt should store attempt and return true (1 ms)

### `quiz.controller.test.ts` - ❌ FAIL (6 passed out of 7)

✅ 6 tests passed

- get_user_quizzes should return 200 with quizzes (27 ms)
- get_quiz should return 200 with a quiz (1 ms)
- update_user_quiz should return 200 on success (3 ms)
- update_user_quiz_visibility should return 200 on success (2 ms)
- delete_user_quiz should return 200 on success (2 ms)
- submit_quiz_attempt should return 200 on success (1 ms)

❌ 1 test failed

- create_user_quiz should return 200 with created quiz (6 ms)
  - **Reason:** Expected response to equal mockQuiz, but received an empty object {}.
  - **Root Cause:** The controller function create_user_quiz did not await the asynchronous createUserQuiz() service call. This resulted in Fastify sending a Promise instead of the resolved quiz object.

### Next Steps:

- Fix: Add await before createUserQuiz(...) in create_user_quiz controller.
- Retest the quiz.controller.test.ts suite to verify all 7 tests pass.

## POST

### `post.service.test.ts` - ✅ PASS

✅ All tests passed (10 total)

- getUserPosts returns posts (4 ms)
- getPost returns post with vote summary (1 ms)
- createPost creates and returns post
- commentOnPost creates comment and updates post
- replyOnComment updates comment replies
- voteOnPost upserts vote (1 ms)
- voteOnComment upserts vote (1 ms)
- addTagOnPost upserts tags (1 ms)
- deletePost deletes the post (1 ms)
- togglePostVisibility updates post visibility

### `post.controller.test.ts` - ✅ PASS

✅ All tests passed (12 total)

- get_user_posts returns 200 (26 ms)
- get_recent_posts returns 200 (1 ms)
- get_post returns 200 (1 ms)
- get_comments returns 200 (4 ms)
- create_post returns 200 (2 ms)
- comment_on_post returns 200 (3 ms)
- vote_on_post returns 200 (2 ms)
- reply_on_comment returns 200 (2 ms)
- vote_on_comment returns 200 (2 ms)
- add_tag_on_post returns 200 (2 ms)
- delete_post returns 200 (1 ms)
- toggle_post_visibility returns 200 (1 ms)

## AI

### `ai.service.test.ts` - ❌ FAIL (5 passed out of 6)

✅ 5 tests passed

- generateQuizFromNote
  - should return AI response text when note exists (5 ms)
- generateFlashcardFromNote
  - should return AI response text for flashcards (1 ms)
- generateQuizFromPrompt
  - should return AI response text from prompt (1 ms)
- generateFlashcardsFromPrompt
  - should return AI flashcard string from prompt (1 ms)
- generateNotesFromPrompt
  - should return generated notes string from prompt (1 ms)

❌ 1 test failed

- generateQuizFromNote should return false if note not found (3 ms)
  - **Reason:** Expected the function to return false, but it returned undefined.
  - **Root Cause:** The generateQuizFromNote function did not explicitly return false when the note wasn't found.

### `ai.controller.test.ts` - ✅ PASS

✅ All tests passed (5 total)

- generate_quiz_from_note should return 200 with content (34 ms)
- generate_flashcards_from_note should return 200 with content (5 ms)
- generate_quiz_from_prompt should return 200 with content (4 ms)
- generate_flashcards_from_prompt should return 200 with content (1 ms)
- generate_notes_from_prompt should return 200 with content (2 ms)

### Next Steps:

- Fix: Add if (!note) return false; inside generateQuizFromNote service function.
- Retest the ai.service.test.ts suite to confirm all 6 tests pass.

</details>

---

# June 25-26, 2025

<details><summary><strong>TL;DR</strong></summary>

## SUMMARY

- ✅ **12 Test Suites Passed**
- ❌ **2 Test Suites Failed**
  - `auth.controller.test.ts` Type mismatch in JWT payload `(phone_number: string | null)`.
  - `quiz.controller.test.ts` Block-scoped variable redeclaration (`result` used multiple times).
- ✅ **86/86 Total Tests Passed**
- 🧪 **Key Modules Tested:** Auth, User, Note, Flashcard, Quiz, Post, AI
- 🛠️ **Main Issues Identified:**
  - `auth.controller.ts`: Fix jwtSign payload to avoid passing nullable fields.
  - `quiz.controller.ts`: Rename or scope `result` variable to prevent redeclarations.

> Overall coverage is excellent. Controller-level type safety issues remain in `auth` and `quiz`, but services are working as expected.

</details>

<details>
<summary><strong>FULL REPORT</strong></summary>

## AUTH

### Result

```
 PASS  tests/auth/auth.service.test.ts (7.789 s)
  Auth Service
    loginUser
      √ should return false if user is not found (14 ms)
      √ should return false if password does not match (1 ms)
      √ should return false if email or password is missing (1 ms)
      √ should return user if credentials match (2 ms)
    registerUser
      √ should hash password and create user instance (3 ms)
      √ should throw error if user creation fails (10 ms)

 FAIL  tests/auth/auth.controller.test.ts
  ● Test suite failed to run

    modules/auth/auth.controller.ts:22:43 - error TS2769: No overload matches this call.
      Overload 1 of 5, '(payload: { [key: string]: any; id: string; first_name: string; last_name: string; email: string; phone_number: string; is_public: boolean; }, options?: FastifyJwtSignOptions | undefined): Promise<...>', gave the following error.
        Argument of type '{ email: string; password: string; id: string; first_name: string; last_name: string; gender: string | null; phone_number: string | null; badges: JsonValue; is_public: boolean; created_at: Date; updated_at: Date; is_admin: boolean; }' is not assignable to parameter of type '{ [key: string]: any; id: string; first_name: string; last_name: string; email: string; phone_number: string; is_public: boolean; }'.
          Types of property 'phone_number' are incompatible.
            Type 'string | null' is not assignable to type 'string'.
              Type 'null' is not assignable to type 'string'.
      Overload 2 of 5, '(payload: { [key: string]: any; id: string; first_name: string; last_name: string; email: string; phone_number: string; is_public: boolean; }, options?: Partial<SignOptions> | undefined): Promise<...>', gave the following error.
        Argument of type '{ email: string; password: string; id: string; first_name: string; last_name: string; gender: string | null; phone_number: string | null; badges: JsonValue; is_public: boolean; created_at: Date; updated_at: Date; is_admin: boolean; }' is not assignable to parameter of type '{ [key: string]: any; id: string; first_name: string; last_name: string; email: string; phone_number: string; is_public: boolean; }'.
          Types of property 'phone_number' are incompatible.
            Type 'string | null' is not assignable to type 'string'.
              Type 'null' is not assignable to type 'string'.

    22         const token = await reply.jwtSign(user);
                                                 ~~~~

    modules/auth/auth.controller.ts:24:44 - error TS2345: Argument of type 'Promise<string> & void' is not assignable to parameter of type 'string'.

    24         reply.setCookie('QUICKEASE_TOKEN', token, {
                                                  ~~~~~
    modules/auth/auth.controller.ts:62:43 - error TS2769: No overload matches this call.
      Overload 1 of 5, '(payload: { [key: string]: any; id: string; first_name: string; last_name: string; email: string; phone_number: string; is_public: boolean; }, options?: FastifyJwtSignOptions | undefined): Promise<...>', gave the following error.
        Argument of type '{ email: string; password: string; id: string; first_name: string; last_name: string; gender: string | null; phone_number: string | null; badges: JsonValue; is_public: boolean; created_at: Date; updated_at: Date; is_admin: boolean; }' is not assignable to parameter of type '{ [key: string]: any; id: string; first_name: string; last_name: string; email: string; phone_number: string; is_public: boolean; }'.
          Types of property 'phone_number' are incompatible.
            Type 'string | null' is not assignable to type 'string'.
              Type 'null' is not assignable to type 'string'.
      Overload 2 of 5, '(payload: { [key: string]: any; id: string; first_name: string; last_name: string; email: string; phone_number: string; is_public: boolean; }, options?: Partial<SignOptions> | undefined): Promise<...>', gave the following error.
        Argument of type '{ email: string; password: string; id: string; first_name: string; last_name: string; gender: string | null; phone_number: string | null; badges: JsonValue; is_public: boolean; created_at: Date; updated_at: Date; is_admin: boolean; }' is not assignable to parameter of type '{ [key: string]: any; id: string; first_name: string; last_name: string; email: string; phone_number: string; is_public: boolean; }'.
          Types of property 'phone_number' are incompatible.
            Type 'string | null' is not assignable to type 'string'.
              Type 'null' is not assignable to type 'string'.

    62         const token = await reply.jwtSign(user);
                                                 ~~~~

    modules/auth/auth.controller.ts:64:44 - error TS2345: Argument of type 'Promise<string> & void' is not assignable to parameter of type 'string'.

    64         reply.setCookie('QUICKEASE_TOKEN', token, {
                                                  ~~~~~
    modules/auth/auth.controller.ts:74:9 - error TS2552: Cannot find name 'error'. Did you mean 'err'?

    74         error("Register error:", err);
               ~~~~~

      modules/auth/auth.controller.ts:73:14
        73     } catch (err) {
                        ~~~
        'err' is declared here.

Test Suites: 1 failed, 1 passed, 2 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        8.974 s
Ran all test suites matching tests/auth.
```

### `auth.service.test.ts` - ✅ PASS

### `auth.controller.test.ts` - ❌ FAIL

> Test suite failed to run: Needs debugging at `auth.controller.ts`. Could be a JWT type mismatch. Ensure the token payload excludes or transforms nullable fields appropriately.

## USER

### Result

```
 PASS  tests/user/user.service.test.ts (5.497 s)
  User Service
    √ getUser should return the user with the given id (11 ms)
    √ changeUserName should update and return the user (1 ms)
    √ toggleProfileVisibility should update is_public field (1 ms)

 PASS  tests/user/user.controller.test.ts (5.612 s)
  User Controller
    get_user
      √ returns 200 with user if found (16 ms)
      √ returns 404 if user not found (1 ms)
      √ returns 500 on service error (2 ms)
    edit_user_name
      √ returns 200 on successful name update (4 ms)
      √ returns 400 for invalid input (3 ms)
      √ returns 500 on service error (3 ms)
    toggle_user_visibility
      √ returns 200 on successful visibility toggle (2 ms)
      √ returns 400 for invalid visibility input (1 ms)
      √ returns 500 on service error (1 ms)

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        7.001 s, estimated 12 s
Ran all test suites matching tests/user.
```

### `user.service.test.ts` - ✅ PASS

### `user.controller.test.ts` - ✅ PASS

## NOTE

### Result

```
 PASS  tests/note/note.service.test.ts (5.221 s)
  Note Service
    √ getUserNotes should return notes by user ID (11 ms)
    √ getUserNote should return single note by ID (2 ms)
    √ createUserNote should create and return a note (1 ms)
    √ updateUserNote should update and return the note (2 ms)
    √ deleteUserNote should delete note and return true (1 ms)
    √ toggleNoteVisibility should update is_public and return true (1 ms)

 PASS  tests/note/note.controller.test.ts (6.374 s)
  Note Controller
    √ get_user_notes should return 200 with notes (111 ms)
    √ get_user_note should return 200 with single note (3 ms)
    √ create_user_note should return 201 with created note (9 ms)
    √ update_user_note should return 200 with updated note (3 ms)
    √ delete_user_note should return 200 on success (3 ms)
    √ toggle_user_note_visibility should return 200 on success (4 ms)
    √ create_user_note should return 400 on invalid input (3 ms)

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        7.593 s, estimated 14 s
Ran all test suites matching tests/note.
```

### `note.service.test.ts` - ✅ PASS

### `note.controller.test.ts` - ✅ PASS

## FLASHCARD

### Result

```
 PASS  tests/flashcard/flashcard.service.test.ts
  Flashcard Service
    √ getUserFlashcards should return flashcards by user ID (11 ms)
    √ getUserFlashcard should return a flashcard by ID (1 ms)
    √ createUserFlashcard should create and return a flashcard (2 ms)
    √ updateUserFlashcard should update and return a flashcard (1 ms)
    √ deleteUserFlashcard should delete and return true (2 ms)
    √ toggleFlashcardVisibility should update is_public and return true (1 ms)

 PASS  tests/flashcard/flashcard.controller.test.ts (5.705 s)
  Flashcard Controller
    √ get_user_flashcards should return 200 with flashcards (95 ms)
    √ get_user_flashcard should return 200 with a flashcard (7 ms)
    √ create_user_flashcard should return 201 on valid input (14 ms)
    √ create_user_flashcard should return 400 on invalid input (9 ms)
    √ update_user_flashcard should return 200 on valid input (9 ms)
    √ update_user_flashcard should return 400 on invalid input (8 ms)
    √ delete_user_flashcard should return 200 on success (7 ms)
    √ toggle_flashcard_visibility should return 200 on success (9 ms)

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        6.818 s, estimated 13 s
Ran all test suites matching tests/flashcard.
```

### `flashcard.service.test.ts` - ✅ PASS

### `flashcard.controller.test.ts` - ✅ PASS

## QUIZ

### Result

```
 PASS  tests/quiz/quiz.service.test.ts (5.095 s)
  Quiz Service
    √ getUserQuizzes should return quizzes by user ID (13 ms)
    √ getQuiz should return quiz with attempts (1 ms)
    √ createUserQuiz should create and return a quiz (2 ms)
    √ updateUserQuiz should update and return quiz (2 ms)
    √ updateUserQuizVisibility should update and return quiz (2 ms)
    √ deleteUserQuiz should delete quiz and return true (2 ms)
    √ submitQuizAttempt should store attempt and return true (2 ms)
    √ getQuizAttempt should return attempt by ID (2 ms)

 FAIL  tests/quiz/quiz.controller.test.ts
  ● Test suite failed to run

    modules/quiz/quiz.controller.ts:137:9 - error TS2451: Cannot redeclare block-scoped variable 'result'.

    137   const result = schema.safeParse({ visibility, quiz_id });
                ~~~~~~
    modules/quiz/quiz.controller.ts:146:9 - error TS2451: Cannot redeclare block-scoped variable 'result'.

    146   const result = schema.safeParse({ visibility, quiz_id });
                ~~~~~~
    modules/quiz/quiz.controller.ts:151:22 - error TS2339: Property 'error' does not exist on type 'never'.

    151       errors: result.error.errors,
                             ~~~~~
    modules/quiz/quiz.controller.ts:207:9 - error TS2451: Cannot redeclare block-scoped variable 'result'.

    207   const result = schema.safeParse({ answer_data, started_at, completed_at, quiz_id });
                ~~~~~~
    modules/quiz/quiz.controller.ts:216:9 - error TS2451: Cannot redeclare block-scoped variable 'result'.

    216   const result = schema.safeParse({ answer_data, started_at, completed_at, quiz_id });
                ~~~~~~
    modules/quiz/quiz.controller.ts:221:22 - error TS2339: Property 'error' does not exist on type 'never'.

    221       errors: result.error.errors,
                             ~~~~~

Test Suites: 1 failed, 1 passed, 2 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        10.012 s
Ran all test suites matching tests/quiz.
```

### `quiz.service.test.ts` - ✅ PASS

### `quiz.controller.test.ts` - ❌ FAIL

> The error message indicates that there are duplicate variable declarations in the `quiz.controller.ts` file.

## POST

### Result

```
 PASS  tests/post/post.service.test.ts
  Post Service
    √ getUserPosts returns posts (6 ms)
    √ getPost returns post with vote summary (1 ms)
    √ createPost creates and returns post (1 ms)
    √ commentOnPost creates comment and updates post (1 ms)
    √ replyOnComment updates comment replies
    √ voteOnPost upserts vote
    √ voteOnComment upserts vote (1 ms)
    √ addTagOnPost upserts tags (1 ms)
    √ deletePost deletes the post
    √ togglePostVisibility updates post visibility (1 ms)

 PASS  tests/post/post.controller.test.ts
  Post Controller
    √ get_user_posts returns 200 (40 ms)
    √ get_recent_posts returns 200 (1 ms)
    √ get_post returns 200 (1 ms)
    √ get_comments returns 200 (3 ms)
    √ create_post returns 200 (21 ms)
    √ comment_on_post returns 200 (2 ms)
    √ vote_on_post returns 200 (1 ms)
    √ reply_on_comment returns 200 (1 ms)
    √ vote_on_comment returns 200 (1 ms)
    √ add_tag_on_post returns 200 (1 ms)
    √ delete_post returns 200 (1 ms)
    √ toggle_post_visibility returns 200 (1 ms)

Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        5.103 s
Ran all test suites matching tests/post.
```

### `post.service.test.ts` - ✅ PASS

### `post.controller.test.ts` - ✅ PASS

## AI

### Result

```
 PASS  tests/ai/ai.service.test.ts
  AI Service
    generateQuizFromNote
      √ should return AI response text when note exists (11 ms)
      √ should return false if note not found (1 ms)
    generateFlashcardFromNote
      √ should return AI response text for flashcards (1 ms)
    generateQuizFromPrompt
      √ should return AI response text from prompt (1 ms)
    generateFlashcardsFromPrompt
      √ should return AI flashcard string from prompt (1 ms)
    generateNotesFromPrompt
      √ should return generated notes string from prompt (1 ms)

 PASS  tests/ai/ai.controller.test.ts (5.698 s)
  AI Controller
    √ generate_quiz_from_note should return 200 with content (56 ms)
    √ generate_flashcards_from_note should return 200 with content (4 ms)
    √ generate_quiz_from_prompt should return 200 with content (3 ms)
    √ generate_flashcards_from_prompt should return 200 with content (3 ms)
    √ generate_notes_from_prompt should return 200 with content (2 ms)

Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        6.856 s, estimated 8 s
Ran all test suites matching tests/ai.
```

### `ai.service.test.ts` - ✅ PASS

### `ai.controller.test.ts` - ✅ PASS

</details>

---
