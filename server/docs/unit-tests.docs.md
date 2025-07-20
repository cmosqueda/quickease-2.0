**This documents all unit tests executed on jest.**

For test case codes and description references, access [this link](https://docs.google.com/spreadsheets/d/1JOolp5MGG8KnSi7auB_1pmLtYCR8nEPIwKX8CYza8HY/edit?usp=sharing) and go to the `Test Case Repository` sheet.

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

- ✅ **13 Test Suites Passed**
- ❌ **1 Test Suite Failed**
  - **UT002** `auth.controller.test.ts` Type mismatch in JWT payload `(phone_number: string | null)`.
- ✅ **93/93 Total Tests Passed**
- 🧪 **Key Modules Tested:** Auth, User, Note, Flashcard, Quiz, Post, AI
- 🛠️ **Main Issues Identified:**
  - `auth.controller.ts`: Fix jwtSign payload to avoid passing nullable fields.

> Overall coverage is excellent. Controller-level type safety issues remain in `auth`, but service is working as expected.

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

### UT001 `auth.service.test.ts` - ✅ PASS

### UT002 `auth.controller.test.ts` - ❌ FAIL

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

### UT003 `user.service.test.ts` - ✅ PASS

### UT004 `user.controller.test.ts` - ✅ PASS

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

### UT005 `note.service.test.ts` - ✅ PASS

### UT006 `note.controller.test.ts` - ✅ PASS

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

### UT007 `flashcard.service.test.ts` - ✅ PASS

### UT008 `flashcard.controller.test.ts` - ✅ PASS

## QUIZ

### Result

```
 PASS  tests/quiz/quiz.service.test.ts
  Quiz Service
    √ getUserQuizzes should return quizzes by user ID (8 ms)
    √ getQuiz should return quiz with attempts (1 ms)
    √ createUserQuiz should create and return a quiz (1 ms)
    √ updateUserQuiz should update and return quiz (1 ms)
    √ updateUserQuizVisibility should update and return quiz (1 ms)
    √ deleteUserQuiz should delete quiz and return true (1 ms)
    √ submitQuizAttempt should store attempt and return true (1 ms)
    √ getQuizAttempt should return attempt by ID (1 ms)

 PASS  tests/quiz/quiz.controller.test.ts
  Quiz Controller
    √ get_user_quizzes should return 200 with quizzes (34 ms)
    √ get_quiz should return 200 with a quiz (1 ms)
    √ create_user_quiz should return 201 with created quiz (5 ms)
    √ update_user_quiz should return 200 on success (3 ms)
    √ update_user_quiz_visibility should return 200 on success (2 ms)
    √ delete_user_quiz should return 200 on success (1 ms)
    √ submit_quiz_attempt should return 200 on success (1 ms)

Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        5.431 s
Ran all test suites matching tests/quiz.
```

### UT009 `quiz.service.test.ts` - ✅ PASS

### UT010 `quiz.controller.test.ts` - ✅ PASS

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

### UT011 `post.service.test.ts` - ✅ PASS

### UT012 `post.controller.test.ts` - ✅ PASS

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

### UT013 `ai.service.test.ts` - ✅ PASS

### UT014 `ai.controller.test.ts` - ✅ PASS

</details>

---

# June 28, 2025

<details>
<summary><strong>TL;DR</strong></summary>

## SUMMARY

✅ **All tests passed** for modules: `auth`, `user`, `note`, `flashcard`, `quiz`, and `ai`.  
❌ **Post module tests failed** (`post.controller.test.ts`, `post.service.test.ts`) due to a **type mismatch** in `validateOwnership()`, where `tx` is expected to be a full `PrismaClient` but receives a partial mock missing internal methods like `$connect` and `$transaction`.

> Recommend: Narrow the expected type of `tx` in `validateOwnership()` to only the models it uses (e.g., `Pick<PrismaClient, 'note' | 'flashcard' | 'quiz'>`) for better test compatibility and maintainability.

</details>

<details>
<summary><strong>FULL REPORT</strong></summary>

## AUTH

### Result

```
 PASS  tests/auth/auth.service.test.ts
  Auth Service
    loginUser
      √ should return false if user is not found (9 ms)
      √ should return false if password does not match (1 ms)
      √ should return false if email or password is missing (2 ms)
      √ should return user if credentials match (1 ms)
    registerUser
      √ should hash password and create user instance (3 ms)
      √ should throw error if user creation fails (9 ms)

  console.error
    Register error: Error: DB Down
        at Object.<anonymous> (C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:173:15)
        at C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-mock\build\index.js:305:39
        at Object.<anonymous> (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-mock\build\index.js:312:13)
        at Object.mockConstructor [as findUnique] (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-mock\build\index.js:102:19)
        at C:\Users\mosqu\forked-quickease-2.0\server\modules\auth\auth.controller.ts:65:46
        at Generator.next (<anonymous>)
        at C:\Users\mosqu\forked-quickease-2.0\server\modules\auth\auth.controller.ts:8:71
        at new Promise (<anonymous>)
        at __awaiter (C:\Users\mosqu\forked-quickease-2.0\server\modules\auth\auth.controller.ts:4:12)
        at register_user (C:\Users\mosqu\forked-quickease-2.0\server\modules\auth\auth.controller.ts:49:12)
        at C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:177:26
        at Generator.next (<anonymous>)
        at C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:41:71
        at new Promise (<anonymous>)
        at __awaiter (C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:37:12)
        at Object.<anonymous> (C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:171:61)
        at Promise.finally.completed (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:1559:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:1499:10)
        at _callCircusTest (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:1009:40)
        at processTicksAndRejections (node:internal/process/task_queues:105:5)
        at _runTest (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:949:3)
        at _runTestsForDescribeBlock (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:829:11)
        at run (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:1920:21)
        at jestAdapter (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\runner.js:101:19)
        at runTestInternal (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-runner\build\testWorker.js:272:16)
        at runTest (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-runner\build\testWorker.js:340:7)
        at Object.worker (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-runner\build\testWorker.js:494:12)

      84 |
      85 |     } catch (err) {
    > 86 |         console.error("Register error:", err);
         |                 ^
      87 |         reply.code(500).send({
      88 |             message: "Internal server error. Could not register user."
      89 |         });

      at modules/auth/auth.controller.ts:86:17
      at modules/auth/auth.controller.ts:8:71
      at __awaiter (modules/auth/auth.controller.ts:4:12)
      at register_user (modules/auth/auth.controller.ts:49:12)
      at tests/auth/auth.controller.test.ts:177:26
      at tests/auth/auth.controller.test.ts:41:71
      at __awaiter (tests/auth/auth.controller.test.ts:37:12)
      at Object.<anonymous> (tests/auth/auth.controller.test.ts:171:61)

 PASS  tests/auth/auth.controller.test.ts (5.07 s)
  Auth Controller
    login_user
      √ should return 400 if email or password is missing (11 ms)
      √ should return 400 if loginUser returns false (2 ms)
      √ should return 200, set cookie, and return is_admin (2 ms)
      √ should return 500 on internal error (2 ms)
    register_user
      √ should return 400 if any required field is missing (1 ms)
      √ should return 406 if email is already taken (1 ms)
      √ should create user and return token (2 ms)
      √ should return 500 if error is thrown (115 ms)
    logout
      √ should clear cookie and return 200 (1 ms)
      √ should return 500 if logout throws (2 ms)

Test Suites: 2 passed, 2 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        6.138 s
Ran all test suites matching tests/auth.
```

### `auth.service.test.ts` - ✅ PASSED

### `auth.controller.test.ts` - ✅ PASSED

> The console error being logged is intentional and expected, simulating a failure in the registerUser function to verify that the controller properly logs the error and returns a status code of 500.

## USER

### Result

```
 PASS  tests/user/user.service.test.ts (5.181 s)
  User Service
    √ getUser should return the user with the given id (12 ms)
    √ changeUserName should update and return the user (1 ms)
    √ toggleProfileVisibility should update is_public field (2 ms)
    √ viewProfile should return full data if is_public is true (2 ms)
    √ viewProfile should return limited data if is_public is false (2 ms)

 PASS  tests/user/user.controller.test.ts (5.421 s)
  User Controller
    get_user
      √ returns 200 with user if found (14 ms)
      √ returns 404 if user not found (2 ms)
      √ returns 500 on service error (2 ms)
    edit_user_name
      √ returns 200 on successful name update (4 ms)
      √ returns 400 for invalid input (3 ms)
      √ returns 500 on service error (2 ms)
    toggle_user_visibility
      √ returns 200 on successful visibility toggle (1 ms)
      √ returns 400 for invalid visibility input (1 ms)
      √ returns 500 on service error (1 ms)
    view_profile
      √ returns 200 with public user (1 ms)
      √ returns 404 if user not found (1 ms)
      √ returns 500 on service error (1 ms)

Test Suites: 2 passed, 2 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        6.546 s, estimated 13 s
Ran all test suites matching tests/user.
```

### `user.service.test.ts` - ✅ PASSED

### `user.controller.test.ts` - ✅ PASSED

## NOTE

### Result

```
 PASS  tests/note/note.service.test.ts (5.135 s)
  Note Service
    √ getUserNotes should return notes by user ID (11 ms)
    √ getUserNote should return single note by ID (1 ms)
    √ createUserNote should create and return a note (2 ms)
    √ updateUserNote should update and return the note (1 ms)
    √ deleteUserNote should delete note and return true (2 ms)
    √ toggleNoteVisibility should update is_public and return true (1 ms)

 PASS  tests/note/note.controller.test.ts (6.374 s)
  Note Controller
    √ get_user_notes should return 200 with notes (61 ms)
    √ get_user_note should return 200 with single note (2 ms)
    √ create_user_note should return 201 with created note (10 ms)
    √ update_user_note should return 200 with updated note (4 ms)
    √ delete_user_note should return 200 on success (3 ms)
    √ toggle_user_note_visibility should return 200 on success (3 ms)
    √ create_user_note should return 400 on invalid input (3 ms)

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        7.576 s
Ran all test suites matching tests/note.
```

### `note.service.test.ts` - ✅ PASSED

### `note.controller.test.ts` - ✅ PASSED

## FLASHCARD

### Result

```
 PASS  tests/flashcard/flashcard.service.test.ts (5.12 s)
  Flashcard Service
    √ getUserFlashcards should return flashcards by user ID (12 ms)
    √ getUserFlashcard should return a flashcard by ID (1 ms)
    √ createUserFlashcard should create and return a flashcard (1 ms)
    √ updateUserFlashcard should update and return a flashcard (1 ms)
    √ deleteUserFlashcard should delete and return true (1 ms)
    √ toggleFlashcardVisibility should update is_public and return true (1 ms)

 PASS  tests/flashcard/flashcard.controller.test.ts (5.932 s)
  Flashcard Controller
    √ get_user_flashcards should return 200 with flashcards (95 ms)
    √ get_user_flashcard should return 200 with a flashcard (9 ms)
    √ create_user_flashcard should return 201 on valid input (15 ms)
    √ create_user_flashcard should return 400 on invalid input (9 ms)
    √ update_user_flashcard should return 200 on valid input (9 ms)
    √ update_user_flashcard should return 400 on invalid input (7 ms)
    √ delete_user_flashcard should return 200 on success (7 ms)
    √ toggle_flashcard_visibility should return 200 on success (7 ms)

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        7.107 s, estimated 14 s
Ran all test suites matching tests/flashcard.
```

### `flashcard.service.test.ts` - ✅ PASSED

### `flashcard.controller.test.ts` - ✅ PASSED

## QUIZ

### Result

```
 PASS  tests/quiz/quiz.service.test.ts (5.38 s)
  Quiz Service
    √ getUserQuizzes should return quizzes by user ID (12 ms)
    √ getQuiz should return quiz with attempts (2 ms)
    √ createUserQuiz should create and return a quiz (2 ms)
    √ updateUserQuiz should update and return quiz (2 ms)
    √ updateUserQuizVisibility should update and return quiz (2 ms)
    √ deleteUserQuiz should delete quiz and return true (1 ms)
    √ submitQuizAttempt should store attempt and return an object (2 ms)
    √ getQuizAttempt should return attempt by ID (2 ms)

 PASS  tests/quiz/quiz.controller.test.ts (6.094 s)
  Quiz Controller
    √ get_user_quizzes should return 200 with quizzes (55 ms)
    √ get_quiz should return 200 with a quiz (25 ms)
    √ create_user_quiz should return 201 with created quiz (9 ms)
    √ update_user_quiz should return 200 on success (3 ms)
    √ update_user_quiz_visibility should return 200 on success (3 ms)
    √ delete_user_quiz should return 200 on success (2 ms)
    √ submit_quiz_attempt should return 200 on success (3 ms)
    √ get_quiz_attempt should return 200 with the attempt (2 ms)

Test Suites: 2 passed, 2 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        7.51 s, estimated 14 s
Ran all test suites matching tests/quiz.
```

### `quiz.service.test.ts` - ✅ PASSED

### `quiz.controller.test.ts` - ✅ PASSED

## POST

### Result

```
 FAIL  tests/post/post.controller.test.ts
  ● Test suite failed to run

    modules/post/post.service.ts:226:57 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    226                 const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                                ~~
    modules/post/post.service.ts:279:57 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    279                 const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                                ~~

 FAIL  tests/post/post.service.test.ts
  ● Test suite failed to run

    modules/post/post.service.ts:226:57 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    226                 const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                                ~~
    modules/post/post.service.ts:279:57 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    279                 const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                                ~~

Test Suites: 2 failed, 2 total
Tests:       0 total
Snapshots:   0 total
Time:        5.647 s
Ran all test suites matching tests/post.
```

### `post.service.test.ts` - ❌ FAILED

### `post.controller.test.ts` - ❌ FAILED

> `tx` of async function `validateOwnership(...)` inside `server/modules/post/post.service.ts` is typed as a full PrismaClient. TypeScript expects `tx` to conform to the full PrismaClient type. However, only 'note', 'flashcard', or 'quiz' models are needed, making everything other than the three client types unnecessary.

## AI

### Result

```
 PASS  tests/ai/ai.service.test.ts
  AI Service
    generateQuizFromNote
      √ should return AI response text when note exists (7 ms)
      √ should return false if note not found
    generateFlashcardFromNote
      √ should return AI response text for flashcards (1 ms)
    generateQuizFromPrompt
      √ should return AI response text from prompt (1 ms)
    generateFlashcardsFromPrompt
      √ should return AI flashcard string from prompt (1 ms)
    generateNotesFromPrompt
      √ should return generated notes string from prompt

 PASS  tests/ai/ai.controller.test.ts
  AI Controller
    √ generate_quiz_from_note should return 200 with content (46 ms)
    √ generate_flashcards_from_note should return 200 with content (3 ms)
    √ generate_quiz_from_prompt should return 200 with content (3 ms)
    √ generate_flashcards_from_prompt should return 200 with content (2 ms)
    √ generate_notes_from_prompt should return 200 with content (2 ms)

Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        4.726 s, estimated 14 s
Ran all test suites matching tests/ai.
```

### `ai.service.test.ts` - ✅ PASSED

### `ai.controller.test.ts` - ✅ PASSED

</details>

---

# July 21, 2025

<details>
<summary><strong>TL;DR</strong></summary>

## SUMMARY

✅ **Quiz Tests Passed:**
All tests for `quiz.service` and `quiz.controller` passed successfully after syncing with updated modules. Leaderboard logic tested and verified.

✅ **Other Modules:**
The rest of the modules worked fine as intended, just like before.

❌ **Post Tests Failed:**
Both `post.service.test.ts` and `post.controller.test.ts` failed due to a type mismatch in tx parameter.
The validateOwnership function expected a full PrismaClient, but was passed a transaction-scoped client (tx). This is a type-only issue — not a runtime bug — and can be resolved by updating the function signature to accept `Prisma.TransactionClient.`

</details>

<details>
<summary><strong>FULL REPORT</strong></summary>

## QUIZ - changes in tests applied according to updated modules

### Result

```
 PASS  tests/quiz/quiz.service.test.ts
  Quiz Service
    √ getUserQuizzes should return quizzes by user ID (13 ms)
    √ createUserQuiz should create and return a quiz (2 ms)
    √ updateUserQuiz should update and return quiz (1 ms)
    √ updateUserQuizVisibility should update and return quiz (2 ms)
    √ deleteUserQuiz should delete quiz and return true (2 ms)
    √ submitQuizAttempt should store attempt and return an object (3 ms)
    √ getQuizAttempt should return attempt by ID (1 ms)
    √ getQuiz should return leaderboard ranks (2 ms)

 PASS  tests/quiz/quiz.controller.test.ts (5.447 s)
  Quiz Controller
    √ get_user_quizzes should return 200 with quizzes (91 ms)
    √ get_quiz should return 200 with a quiz (4 ms)
    √ create_user_quiz should return 201 with created quiz (11 ms)
    √ update_user_quiz should return 200 on success (5 ms)
    √ update_user_quiz_visibility should return 200 on success (4 ms)
    √ delete_user_quiz should return 200 on success (2 ms)
    √ submit_quiz_attempt should return 200 on success (4 ms)
    √ get_quiz_attempt should return 200 with the attempt (2 ms)

Test Suites: 2 passed, 2 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        6.523 s, estimated 8 s
Ran all test suites matching tests/quiz.
```

### `quiz.service.test.ts` - ✅ PASSED

### `quiz.controller.test.ts` - ✅ PASSED

## POST - changes in tests applied according to updated modules

### Result

```
 FAIL  tests/post/post.controller.test.ts
  ● Test suite failed to run

    modules/post/post.service.ts:254:49 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    254         const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                        ~~
    modules/post/post.service.ts:326:49 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    326         const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                        ~~

 FAIL  tests/post/post.service.test.ts
  ● Test suite failed to run

    modules/post/post.service.ts:254:49 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    254         const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                        ~~
    modules/post/post.service.ts:326:49 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    326         const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                        ~~

Test Suites: 2 failed, 2 total
Tests:       0 total
Snapshots:   0 total
Time:        8.961 s
Ran all test suites matching tests/post.
```

### `post.service.test.ts` - ❌ FAILED

### `post.controller.test.ts` - ❌ FAILED

Error in both service and controller, specifically in the `tx` parameter, but nothing serious. Just a prisma client type validation error.

## Other Modules - works fine as before ✅

- auth ✅
- user ✅
- ai ✅
- flashcard ✅
- note ✅

### Overall Results

```
 PASS  tests/user/user.service.test.ts (15.697 s)
  User Service
    √ getUser should return the user with the given id (17 ms)
    √ changeUserName should update and return the user (30 ms)
    √ toggleProfileVisibility should update is_public field (3 ms)
    √ viewProfile should return full data if is_public is true (3 ms)
    √ viewProfile should return limited data if is_public is false (3 ms)

  console.error
    Register error: Error: DB Down
        at Object.<anonymous> (C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:173:15)
        at C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-mock\build\index.js:305:39
        at Object.<anonymous> (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-mock\build\index.js:312:13)
        at Object.mockConstructor [as findUnique] (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-mock\build\index.js:102:19)
        at C:\Users\mosqu\forked-quickease-2.0\server\modules\auth\auth.controller.ts:74:42
        at Generator.next (<anonymous>)
        at C:\Users\mosqu\forked-quickease-2.0\server\modules\auth\auth.controller.ts:8:71
        at new Promise (<anonymous>)
        at __awaiter (C:\Users\mosqu\forked-quickease-2.0\server\modules\auth\auth.controller.ts:4:12)
        at register_user (C:\Users\mosqu\forked-quickease-2.0\server\modules\auth\auth.controller.ts:56:12)
        at C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:177:26
        at Generator.next (<anonymous>)
        at C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:41:71
        at new Promise (<anonymous>)
        at __awaiter (C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:37:12)
        at Object.<anonymous> (C:\Users\mosqu\forked-quickease-2.0\server\tests\auth\auth.controller.test.ts:171:61)
        at Promise.finally.completed (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:1559:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:1499:10)
        at _callCircusTest (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:1009:40)
        at processTicksAndRejections (node:internal/process/task_queues:105:5)
        at _runTest (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:949:3)
        at _runTestsForDescribeBlock (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:839:13)
        at _runTestsForDescribeBlock (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:829:11)
        at _runTestsForDescribeBlock (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:829:11)
        at run (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:757:3)
        at runAndTransformResultsToJestFormat (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\jestAdapterInit.js:1920:21)
        at jestAdapter (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-circus\build\runner.js:101:19)
        at runTestInternal (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-runner\build\testWorker.js:272:16)
        at runTest (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-runner\build\testWorker.js:340:7)
        at Object.worker (C:\Users\mosqu\forked-quickease-2.0\server\node_modules\jest-runner\build\testWorker.js:494:12)

       95 |       });
       96 |   } catch (err) {
    >  97 |     console.error("Register error:", err);
          |             ^
       98 |     reply.code(500).send({
       99 |       message: "Internal server error. Could not register user.",
      100 |     });

      at modules/auth/auth.controller.ts:97:13
      at modules/auth/auth.controller.ts:8:71
      at __awaiter (modules/auth/auth.controller.ts:4:12)
      at register_user (modules/auth/auth.controller.ts:56:12)
      at tests/auth/auth.controller.test.ts:177:26
      at tests/auth/auth.controller.test.ts:41:71
      at __awaiter (tests/auth/auth.controller.test.ts:37:12)
      at Object.<anonymous> (tests/auth/auth.controller.test.ts:171:61)

 PASS  tests/auth/auth.controller.test.ts (15.984 s)
  Auth Controller
    login_user
      √ should return 400 if email or password is missing (40 ms)
      √ should return 400 if loginUser returns false (3 ms)
      √ should return 200, set cookie, and return is_admin (3 ms)
      √ should return 500 on internal error (4 ms)
    register_user
      √ should return 400 if any required field is missing (13 ms)
      √ should return 406 if email is already taken (2 ms)
      √ should create user and return token (4 ms)
      √ should return 500 if error is thrown (251 ms)
    logout
      √ should clear cookie and return 200 (2 ms)
      √ should return 500 if logout throws (2 ms)

 PASS  tests/user/user.controller.test.ts (16.023 s)
  User Controller
    get_user
      √ returns 200 with user if found (29 ms)
      √ returns 404 if user not found (17 ms)
      √ returns 500 on service error (9 ms)
    edit_user_name
      √ returns 200 on successful name update (11 ms)
      √ returns 400 for invalid input (5 ms)
      √ returns 500 on service error (2 ms)
    toggle_user_visibility
      √ returns 200 on successful visibility toggle (3 ms)
      √ returns 400 for invalid visibility input (2 ms)
      √ returns 500 on service error (8 ms)
    view_profile
      √ returns 200 with public user (4 ms)
      √ returns 404 if user not found (3 ms)
      √ returns 500 on service error (2 ms)

 PASS  tests/auth/auth.service.test.ts (16.237 s)
  Auth Service
    loginUser
      √ should return false if user is not found (22 ms)
      √ should return false if password does not match (2 ms)
      √ should return false if email or password is missing (2 ms)
      √ should return user if credentials match (3 ms)
    registerUser
      √ should hash password and create user instance (5 ms)
      √ should throw error if user creation fails (33 ms)

 PASS  tests/quiz/quiz.service.test.ts
  Quiz Service
    √ getUserQuizzes should return quizzes by user ID (4 ms)
    √ createUserQuiz should create and return a quiz (3 ms)
    √ updateUserQuiz should update and return quiz (2 ms)
    √ updateUserQuizVisibility should update and return quiz (1 ms)
    √ deleteUserQuiz should delete quiz and return true (2 ms)
    √ submitQuizAttempt should store attempt and return an object (5 ms)
    √ getQuizAttempt should return attempt by ID (1 ms)
    √ getQuiz should return leaderboard ranks (4 ms)

 PASS  tests/ai/ai.service.test.ts
  AI Service
    generateQuizFromNote
      √ should return AI response text when note exists (5 ms)
      √ should return false if note not found (2 ms)
    generateFlashcardFromNote
      √ should return AI response text for flashcards (2 ms)
    generateQuizFromPrompt
      √ should return AI response text from prompt (1 ms)
    generateFlashcardsFromPrompt
      √ should return AI flashcard string from prompt (2 ms)
    generateNotesFromPrompt
      √ should return generated notes string from prompt (3 ms)

 PASS  tests/flashcard/flashcard.service.test.ts
  Flashcard Service
    √ getUserFlashcards should return flashcards by user ID (8 ms)
    √ getUserFlashcard should return a flashcard by ID (3 ms)
    √ createUserFlashcard should create and return a flashcard (7 ms)
    √ updateUserFlashcard should update and return a flashcard (5 ms)
    √ deleteUserFlashcard should delete and return true (3 ms)
    √ toggleFlashcardVisibility should update is_public and return true (8 ms)

 PASS  tests/note/note.service.test.ts
  Note Service
    √ getUserNotes should return notes by user ID (8 ms)
    √ getUserNote should return single note by ID (10 ms)
    √ createUserNote should create and return a note (4 ms)
    √ updateUserNote should update and return the note (1 ms)
    √ deleteUserNote should delete note and return true (1 ms)
    √ toggleNoteVisibility should update is_public and return true (1 ms)

 PASS  tests/quiz/quiz.controller.test.ts
  Quiz Controller
    √ get_user_quizzes should return 200 with quizzes (106 ms)
    √ get_quiz should return 200 with a quiz (12 ms)
    √ create_user_quiz should return 201 with created quiz (42 ms)
    √ update_user_quiz should return 200 on success (6 ms)
    √ update_user_quiz_visibility should return 200 on success (5 ms)
    √ delete_user_quiz should return 200 on success (3 ms)
    √ submit_quiz_attempt should return 200 on success (6 ms)
    √ get_quiz_attempt should return 200 with the attempt (7 ms)

 PASS  tests/note/note.controller.test.ts (17.977 s)
  Note Controller
    √ get_user_notes should return 200 with notes (106 ms)
    √ get_user_note should return 200 with single note (4 ms)
    √ create_user_note should return 201 with created note (17 ms)
    √ update_user_note should return 200 with updated note (8 ms)
    √ delete_user_note should return 200 on success (9 ms)
    √ toggle_user_note_visibility should return 200 on success (6 ms)
    √ create_user_note should return 400 on invalid input (5 ms)

 PASS  tests/flashcard/flashcard.controller.test.ts (18.284 s)
  Flashcard Controller
    √ get_user_flashcards should return 200 with flashcards (171 ms)
    √ get_user_flashcard should return 200 with a flashcard (26 ms)
    √ create_user_flashcard should return 201 on valid input (27 ms)
    √ create_user_flashcard should return 400 on invalid input (17 ms)
    √ update_user_flashcard should return 200 on valid input (14 ms)
    √ update_user_flashcard should return 400 on invalid input (12 ms)
    √ delete_user_flashcard should return 200 on success (13 ms)
    √ toggle_flashcard_visibility should return 200 on success (15 ms)

 PASS  tests/ai/ai.controller.test.ts (18.464 s)
  AI Controller
    √ generate_quiz_from_note should return 200 with content (135 ms)
    √ generate_flashcards_from_note should return 200 with content (7 ms)
    √ generate_quiz_from_prompt should return 200 with content (9 ms)
    √ generate_flashcards_from_prompt should return 200 with content (4 ms)
    √ generate_notes_from_prompt should return 200 with content (7 ms)

 FAIL  tests/post/post.service.test.ts
  ● Test suite failed to run

    modules/post/post.service.ts:254:49 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    254         const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                        ~~
    modules/post/post.service.ts:326:49 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    326         const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                        ~~

 FAIL  tests/post/post.controller.test.ts
  ● Test suite failed to run

    modules/post/post.service.ts:254:49 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    254         const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                        ~~
    modules/post/post.service.ts:326:49 - error TS2345: Argument of type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is not assignable to parameter of type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
      Type 'Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">' is missing the following properties from type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>': $on, $connect, $disconnect, $use, and 2 more.

    326         const isOwner = await validateOwnership(tx, user_id, resource_type, resource_id);
                                                        ~~

Test Suites: 2 failed, 12 passed, 14 total
Tests:       87 passed, 87 total
Snapshots:   0 total
Time:        23.598 s
Ran all test suites.
```

</details>
