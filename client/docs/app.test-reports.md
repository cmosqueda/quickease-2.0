**This documents all app test reports.**

For test case codes and description references, access [this link](https://docs.google.com/spreadsheets/d/1JOolp5MGG8KnSi7auB_1pmLtYCR8nEPIwKX8CYza8HY/edit?usp=sharing) and go to the `Test Case Repository` sheet.

---

# June 21, 2025

<details>
<summary><strong>TL;DR</strong></summary>

## SUMMARY

- ⚠️ **Register**

  - Partially passed.
  - Major issue: Registration proceeds even when only _email_ and _password_ are filled.
  - **Recommendation**: Add validation to ensure all required fields are filled before submission.
  - Toast messages need to be clearer for users.

- ✅ **Log-in**

  - Fully passed all criteria.
  - Works as expected with valid credentials.
  - **Minor Issue**: Error-handling toasts show raw API status codes — recommend user-friendly messages.

- ✅ **Flashcards (Manual Creation)**

  - All features passed.
  - Works as intended, including front/back previews and flip animations.
  - **UX Suggestion**: Add visual distinction between front and back (e.g., different background colors).

- ⚠️ **Notes (Manual Creation)**
  - Mostly passed; note creation, editing, and saving work well.
  - **Minor Issue**: `Quote` markdown function does not work.

</details>

<details><summary><strong>FULL REPORT</strong></summary>

## Register

Criterias:

- R001: The input fields must respond no more than 0.8s when clicked.
- R002: The user can only register with a valid, NEW email. Used emails are not allowed for re-registration.
- R003: Require user to enter ALL input fields (first name, last name, email, password, confirm password).
- R004: Account creation MUST ONLY proceed if user SUCCESSFULLY fills in ALL required input fields (first name, last name, email, password, confirm password).
- R005: Error-handling pop-ups/toasts understandable for users are implemented.
- R006: The user must be directed to `Log in` screen when the highlighted `Sign in` text is clicked.

Success Rate:

- R001: 100%
- R002: 100%
- R003: 0%
- R004: 0%
- R005: 70%
- R006: 100%

Status: **PARTIAL PASSED**

Feedback by Mosqueda:

- Registration worked properly, especially with `email` validation.
- Error-handling pop-ups/toasts gives only api requests status codes. This is minimal priority.
- But when I tried registering with filling in only the `email` and `password` fields, the registration proceeded as unexpected.
- RECOMMENDATION: Input fields error handling is needed. Toasts must display notifications that can be understood by users. Highly recommends all input fields to be required.

## Log-in

Criterias:

- L001: The input fields must respond no more than 0.8s when clicked.
- L002: The user can only log in with a registered account (used email).
- L003: Error-handling pop-ups/toasts understandable for users are implemented.
- L004: Account log in MUST ONLY proceed if valid and existing user account credentials in the database are entered.
- L005: The user must be directed to `Register` screen when the highlighted `Register Now` text is clicked.

Success Rate:

- L001: 100%
- L002: 100%
- L003: 70%
- L004: 100%
- L005: 100%

Status: **PASSED**

Feedback by Mosqueda:

- Log in works as expected.
- Error-handling pop-ups/toasts gives only api requests status codes. This is minimal priority.

## Learner Notes - Manual Creation

Criterias:

- LN001: User can create notes manually.
- LN002: All implemented markdown functions work properly
- LN003: User can edit the existing note and save it properly.
- LN004: User can view saved notes

Success Rate:

- LN001: 100%
- LN002: 90%
- LN003: 100%
- LN004: 100%

Status: **PARTIAL PASSED**

Feedback by Mosqueda:

- Creating manual notes work properly as expected.
- The `quote` markdown function does not work.
- Can edit and save notes properly. Tested both in api and frontend.

## Learner Flashcards - Manual Creation

Criterias:

- LFC001: User can create flashcards manually
- LFC002: User can preview front content and back content of flashcards.
- LFC003: Front and back contents must display accurately.
- LFC004: User can review flashcards. When a user clicks on the card component, the UI must respond with a flip in no more than 0.8s.

Success Rate:

- LFC001: 100%
- LFC002: 100%
- LFC003: 100%
- LFC004: 100%

Status: **PASSED**

Feedback by Mosqueda:

- Flashcards work well as expected.
- RECOMMENDATION: There should be distinction if the card is facing front or back. Maybe, differentiate the color of the cards background.

</details>

---

# June 26, 2025

<details>
<summary><strong>TL;DR</strong></summary>

## SUMMARY

- ✅ **Log-in**, **Logout**, **Learner Library**, and **Learner Forums** modules **PASSED** with all major features working as expected. Only minor UX improvements (e.g., better toast messages) are needed.
- ✅ **Learner Quiz** **PASSED WITH MINIMAL FIXES**. Core features like creating, editing, scoring, and reviewing quizzes work. However, submitting answers and card UI (ellipsis) needs fixing.
- 🟡 **Learner Flashcards** **PARTIAL PASSED**. Creating, viewing, deleting works fine, but editing flashcards (manual & AI) fails due to server-side errors.
- ❌ **Register** and **Learner Notes** **FAILED** due to missing input validations, error message handling, and saving/editing issues that result in data loss or rendering errors.

> **Overall:** Core functionalities are mostly in place. Emphasis should be placed on improving form validation feedback, data preservation, and error handling on the client side.

</details>

<details>
<summary><strong>FULL REPORT</strong></summary>

## Register

Criteria and Success Rate:

- **R001** – 100% – The input fields must respond no more than 0.8s when clicked.
- **R002** – - – The user can only register with a valid, NEW email. Used emails are not allowed for re-registration.
- **R003** – - – Require user to enter ALL input fields (first name, last name, email, password, confirm password).
- **R004** – - – Account creation MUST ONLY proceed if user SUCCESSFULLY fills in ALL required input fields.
- **R005** – 0% – Error-handling pop-ups/toasts understandable for users are implemented.
- **R006** – 100% – The user must be directed to `Log in` screen when the highlighted `Sign in` text is clicked.

Status: ❌ **FAILED**

Feedback:

- Has controller-level error handling especially in validating inputs, but is not explicitly displayed at the interface.
- If I register a new user account, the new data is successfully saved at the database. But the console tells that there is a problem in handling registration at client-side `client\src\routes\(auth)\AuthRegister.tsx`
- This may be connected to the error not resolved at `auth.controller.ts`

## Log-in

Criteria and Success Rate:

- **L001** – 100% – The input fields must respond no more than 0.8s when clicked.
- **L002** – 100% – The user can only log in with a registered account (used email).
- **L003** – 50% – Error-handling pop-ups/toasts understandable for users are implemented.
- **L004** – 100% – Log in must only proceed if valid credentials are entered.
- **L005** – 100% – The user must be directed to `Register` screen when the highlighted `Register Now` text is clicked.
- **L006** – 100% – User can logout

Status: ✅ **PASSED**

Feedback:

- Only need improvement at defining toast messages understandable for users. Replace error codes with simple, readable error messages.

## Learner Notes

Criteria and Success Rate:

- **LN001** – 0% – User can create notes manually.
- **LN002** – 90% – All implemented markdown functions work properly.
- **LN003** – 100% – User can edit the existing note inside text box.
- **LN004** – 100% – User can view saved notes.
- **LN005** – - – Ellipsis icon is available and clickable for viewing additional notes options.
- **LN006** – 50% – User can save notes properly.
- **LN007** – 100% – Back button redirects user to Library Notes module.
- **LN008** – - – User can delete an existing note.
- **LN009** – - – Users can share a note via "more options".
- **LN010** – - – Ellipsis icon is available and clickable on note card.

Status: ❌ **FAILED**

Feedback:

- Render errors at `client/src/routes/(learner)/(note)/LearnerCreateNote.tsx`, **data** at `const [html, setHTML] = useState(data.content);` not defined.
- `Quote` markdown functionality not working
- Saving works at creating new notes, but needs fixing at saving edited existing notes.
  > Scenario: When `save changes` button is clicked without editing any existing content, it erases the previously saved content, results into losing previously saved data at `notes_content` column

## Learner Flashcards

Criteria and Success Rate:

- **LFC001** – 100% – User can create flashcards manually.
- **LFC002** – 100% – User can preview front and back contents of flashcards.
- **LFC003** – 100% – Flashcard contents display accurately.
- **LFC004** – 100% – Flashcards respond with a flip in no more than 0.8s.
- **LFC005** – 100% – Ellipsis icon is available and clickable on flashcards page.
- **LFC006** – 100% – Back button redirects user to Library Flashcards module.
- **LFC007** – 0% – User can edit manually created flashcards.
- **LFC008** – 0% – User can edit AI-generated flashcards.
- **LFC009** – - – User can share flashcards via "more options".
- **LFC010** – 100% – User can delete an existing flashcard set.
- **LFC011** – - – Ellipsis icon is available and clickable on flashcard card.

Status: ✅ **PARTIAL PASSED**

Feedback:

- User cannot edit existing flashcard created manually or created from AI generation. Error persists at
  ```
    LearnerEditFlashcard.tsx:48
    PUT http://localhost:3000/api/flashcard/update 400 (Bad Request)
    handleSave	@	LearnerEditFlashcard.tsx:48
    <button>
    LearnerEditFlashcardPage	@	LearnerEditFlashcard.tsx:84
  ```

## Learner Quiz

Criteria and Success Rate:

- **LQ001** – 100% – UI/buttons respond in no more than 0.8s.
- **LQ002** – 100% – User can create quizzes manually.
- **LQ003** – 100% – User can edit quizzes and save properly.
- **LQ004** – 0% – User can answer and review quizzes.
- **LQ005** – 100% – Correct answers are displayed as expected.
- **LQ006** – 100% – Exact scores are calculated and displayed.
- **LQ007** – 100% – Quiz review is available after answering.
- **LQ008** – 0% – Back button should redirect to Library Quiz module.
- **LQ009** – 100% – User can delete existing quizzes.
- **LQ010** – 100% – User can edit AI-generated quizzes.
- **LQ011** – 100% – Ellipsis icon works on quiz page preview.
- **LQ012** – 20% – Ellipsis icon is clickable on quiz card.

Status: ✅ **PASSED WITH MINIMAL FIXES**

Feedback:

- Can create quiz manually but no popup/toast notification to notify users if the quiz is saved properly.
- Can edit and delete, toast notifications are displayed properly
- Error in answering / submitting answer attempts. Error persists at
  ```LearnerAnswerQuiz.tsx:72
  POST http://localhost:3000/api/quiz/submit 400 (Bad Request)
  handleSubmit	@	LearnerAnswerQuiz.tsx:72
  <button>
  LearnerAnswerQuizPage	@	LearnerAnswerQuiz.tsx:116
  ```
- Ellipsis icon is not yet functional at quiz card

## Learner Library

Criteria and Success Rate:

- **LL001** – - – Search functionality returns accurate results.
- **LL002** – 100% – Learner's materials data are fetched and displayed properly.
- **LL003** – 100% – Filter works for `AI-Generated` or `From User`.

Status: ✅ **PASSED**

Feedback:

- All implementations passed. Only improvements needed.

## Learner Forums

Criteria and Success Rate:

- **LF001** – 100% – User can create a post in forums.
- **LF002** – - – User can edit an existing post.
- **LF003** – - – User can upload Summary Notes from the Library.
- **LF004** – - – User can upload Quiz from the Library.
- **LF005** – - – User can upload Flashcard Quiz from the Library.
- **LF006** – - – _(Undefined)_
- **LF007** – - – _(Undefined)_

Status: ✅ **PASSED**

Feedback:

- Create post on forums works properly as expected.

</details>

---

# June 28, 2025

<details>
<summary><strong>TL;DR</strong></summary>

## SUMMARY

</details>

<details>
<summary><strong>FULL REPORT</strong></summary>

## Register

Criterias and Success Rate:

- **R001** – 100% – User can register with valid email and password.
- **R002** – 100% – The user can only register with a valid, NEW email. Used emails are not allowed for re-registration.
- **R003** – 100% – Require user to enter ALL input fields (first name, last name, email, password, confirm password).
- **R004** – 100% – Account creation MUST ONLY proceed if user SUCCESSFULLY fills in ALL required input fields (first name, last name, email, password, confirm password).
- **R005** – 100% – Error-handling pop-ups/toasts understandable for users are implemented.
- **R006** – 100% – The user must be directed to `Log in` screen when the highlighted `Sign in` text is clicked.

Status: ✅ PASSED

Feedback:

- Fixes are now applied. Every module works as expected and intended.

## Log-in

Criterias and Success Rate:

- **L001** – 100% – The input fields must respond no more than 0.8s when clicked.
- **L002** – 100% – The user can only log in with a registered account (used email).
- **L003** – 100% – Error-handling pop-ups/toasts understandable for users are implemented.
- **L004** – 100% – Account log in MUST ONLY proceed if valid and existing user account credentials in the database are entered.
- **L005** – 100% – The user must be directed to `Register` screen when the highlighted `Register Now` text is clicked.
- **L006** – 100% – The user can log out.

Status: ✅ PASSED

Feedback:

- Fixes are now applied. Every module works as expected and intended.

## Learner Notes

Criterias and Success Rate:

- **LN001** – % – User can create notes manually.
- **LN002** – % – All implemented markdown functions work properly
- **LN003** – % – User can edit the existing note inside text box
- **LN004** – % – User can view saved notes
- **LN005** – % – At notes page, an ellipsis icon is available and clickable for viewing additional notes options
- **LN006** – % – User can save notes properly
- **LN007** – % – When clicking the back button on the selected sumary notes, user should be redirected to Library Notes module
- **LN008** – % – User can delete an existing note
- **LN009** – % – Users can share a note either from Note Card or from Note Page, through "more options"
- **LN010** – % – At notes card, an ellipsis icon is available and clickable for viewing additional notes options

Status:

Feedback:

## Learner Flashcards

Criterias and Success Rate:

- **LFC001** – % – User can create flashcards manually
- **LFC002** – % – User can preview front content and back content of flashcards.
- **LFC003** – % – Front and back contents of flashcards must display accurately.
- **LFC004** – % – User can review flashcards. When a user clicks on the card component, the UI must respond with a flip in no more than 0.8s.
- **LFC005** – % – At flashcards page, an ellipsis icon is available and clickable for viewing additional flashcard set options at the flashcard set card component
- **LFC006** – % – When clicking the back button on the selected flashcard, user should be redirected to Library Flashcards module
- **LFC007** – % – User can edit the existing flashcard created manually
- **LFC008** – % – User can edit the existing flashcard created from AI generation
- **LFC009** – % – User can share a flashcard set either from Flashcard Set Card or from Flashcard Page, through "more options"
- **LFC010** – % – User can delete an existing flashcard set
- **LFC011** – % – At flashcards set card, an ellipsis icon is available and clickable for viewing additional flashcard set options at the flashcard set card component

Status:

Feedback:

## Learner Quiz

Criterias and Success Rate:

- **LQ001** – % – The UI and buttons respond in no more than 0.8s when clicked.
- **LQ002** – % – User can create quizzes manually.
- **LQ003** – % – User can edit the existing quiz created manually
- **LQ004** – % – User can answer and review existing saved quiz.
- **LQ005** – % – Correct answer(s) from multiple choice are displayed as expected.
- **LQ006** – % – Exact scores are calculated and displayed as expected after answering the quiz/reviewing the quiz overview.
- **LQ007** – % – After a quiz is answered, a quiz review is available for viewing.
- **LQ008** – % – When clicking the back button on the selected quiz, user should be redirected to Library Quiz module
- **LQ009** – % – User can delete an existing quiz
- **LQ010** – % – User can edit the existing quiz created from AI generation

Status:

Feedback:

## Learner Library

Criterias and Success Rate:

- **LL001** – % – Search functionality returns accurate results.
- **LL002** – % – All learner's materials data (notes, flashcards, quizzes) are fetched accordingly and displays as expected.
- **LL003** – % – Filter `AI-Generated` or `From User` (manually created) materials.

## Learner Forums - Post

Criterias and Success Rate:

- **LF001** – % – User(s) can create a post in forums
- **LF002** – % – User can edit an existing post they owned
- **LF003** – % – User can delete their existing post
- **LF004** – % – User can select and attach summary notes to share in a post
- **LF005** – % – User can select and attach flashcards to share in a post
- **LF006** – % – User can select and attach quizzes to share in a post
- **LF007** – % – User(s) can upvote or downvote an existing post
- **LF0011** – % – User(s) can report a post

Status:

Feedback:

## Learner Forums - Comments

Criterias and Success Rate:

- **LF008** – % – User(s) can comment to a post
- **LF009** – % – User(s) can reply to a comment (like threaded replies)
- **LF010** – % – User(s) can upvote or downvote an existing comment
- **LF012** – % – User(s) can report a comment

Status:

Feedback:

## Learner Forums - Report Management

Criterias and Success Rate:

Status:

Feedback:

## Learner Forums - Quiz Sharing

Criterias and Success Rate:

- **QS001** – 100% – User(s) can answer a shared quiz
- **QS002** – 30% – Multiple users' scores and attempts are saved properly and accurately mapped to the corresponding user.
- **QS003** – - – Leaderboard rankings for multiple users who answered a shared quiz is implemented

Status: ⚠️ **PARTIALLY PASSED**

Feedback:

- Only the owner can edit their quiz which is correctly implemented as expected.
- Multiple users' attempts and scores are saved properly and can be viewed by other users but it doesn't show whose user owned which attempt/score. Accurate mapping of scores/attempts to corresponding users must be implemented.

## Profile

</details>
