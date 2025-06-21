**This documents all app test reports.**

For test case codes and description references, access [this link](https://docs.google.com/spreadsheets/d/1JOolp5MGG8KnSi7auB_1pmLtYCR8nEPIwKX8CYza8HY/edit?usp=sharing) and go to the `Test Case Repository` sheet.

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

## Learner - Notes (Manual Creation)

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

## Learner - Flashcards (Manual Creation)

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
