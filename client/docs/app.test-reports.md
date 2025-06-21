This documents all app test reports

---

# June 21, 2025

## TL;DR:

<details>
<summary><strong>Summary of Test Results</strong></summary>

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

## Register

Criterias:

- C1: The input fields must respond no more than 0.8s when clicked.
- C2: The user can only register with a valid, NEW email. Used emails are not allowed for re-registration.
- C3: Require user to enter ALL input fields (first name, last name, email, password, confirm password).
- C4: Account creation MUST ONLY proceed if user SUCCESSFULLY fills in ALL required input fields (first name, last name, email, password, confirm password).
- C5: Error-handling pop-ups/toasts understandable for users are implemented.
- C6: The user must be directed to `Log in` screen when the highlighted `Sign in` text is clicked.

Success Rate:

- C1: 100%
- C2: 100%
- C3: 0%
- C4: 0%
- C5: 70%
- C6: 100%

Status: **PARTIAL PASSED**

Feedback by Mosqueda:

- Registration worked properly, especially with `email` validation.
- Error-handling pop-ups/toasts gives only api requests status codes. This is minimal priority.
- But when I tried registering with filling in only the `email` and `password` fields, the registration proceeded as unexpected.
- RECOMMENDATION: Input fields error handling is needed. Toasts must display notifications that can be understood by users. Highly recommends all input fields to be required.

## Log-in

Criterias:

- C1: The input fields must respond no more than 0.8s when clicked.
- C2: The user can only log in with a registered account (used email).
- C3: Error-handling pop-ups/toasts understandable for users are implemented.
- C4: Account log in MUST ONLY proceed if valid and existing user account credentials in the database are entered.
- C5: The user must be directed to `Register` screen when the highlighted `Register Now` text is clicked.

Success Rate:

- C1: 100%
- C2: 100%
- C3: 70%
- C4: 100%
- C5: 100%

Status: **PASSED**

Feedback by Mosqueda:

- Log in works as expected.
- Error-handling pop-ups/toasts gives only api requests status codes. This is minimal priority.

## Learner - Notes (Manual Creation)

Criterias:

- C1: User can create notes manually.
- C2: All implemented markdown functions work properly
- C3: User can edit the existing note and save it properly.
- C4: User can view saved notes

Success Rate:

- C1: 100%
- C2: 90%
- C3: 100%
- C4: 100%

Status: **PARTIAL PASSED**

Feedback by Mosqueda:

- Creating manual notes work properly as expected.
- The `quote` markdown function does not work.
- Can edit and save notes properly. Tested both in api and frontend.

## Learner - Flashcards (Manual Creation)

Criterias:

- C1: User can create flashcards manually
- C2: User can preview front content and back content of flashcards.
- C3: Front and back contents must display accurately.
- C4: User can review flashcards. When a user clicks on the card component, the UI must respond with a flip in no more than 0.8s.

Success Rate:

- C1: 100%
- C2: 100%
- C3: 100%
- C4: 100%

Status: **PASSED**

Feedback by Mosqueda:

- Flashcards work well as expected.
- RECOMMENDATION: There should be distinction if the card is facing front or back. Maybe, differentiate the color of the cards background.
