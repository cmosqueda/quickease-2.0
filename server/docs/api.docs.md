# API tests documentation on Postman

This contains all the API routes tests executed on Postman.

---

# AUTH ROUTES

## POST /api/auth/register

Registers a new user.

### Request Body

```json
{
  "firstName": "Sanya",
  "lastName": "Lopez",
  "email": "tinesarkiv@gmail.com",
  "password": "t2004"
}
```

### Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJkOTU0ZTUwLWEyZTYtNGU3MC1iZWU4LWNmZDIwNjI1NjgyZCIsInBhc3N3b3JkIjoiJDJiJDEwJG9hMFN1Mk5lM1dCMFRTYjNJNWloUk9GcXI2S3VjMVJGOFBZblo5MDhNZHpqRUU2d28uM1V5IiwiZmlyc3RfbmFtZSI6IlNhbnlhIiwibGFzdF9uYW1lIjoiTG9wZXoiLCJlbWFpbCI6InRpbmVzYXJraXZAZ21haWwuY29tIiwiZ2VuZGVyIjpudWxsLCJwaG9uZV9udW1iZXIiOm51bGwsImJhZGdlcyI6bnVsbCwiaXNfcHVibGljIjp0cnVlLCJjcmVhdGVkX2F0IjoiMjAyNS0wNi0xM1QxMDoyODoyMC42OTJaIiwidXBkYXRlZF9hdCI6IjIwMjUtMDYtMTNUMTA6Mjg6MjAuNjkyWiIsImlhdCI6MTc0OTgxMDUwMH0.fucPfgYRXXe66GkUbQ184BLtf3LV1q7p6bwPRttZxKE"
}
```

## POST /api/auth/login

Logs in an existing user.

### Request Body

```json
{
  "email": "tinesarkiv@gmail.com",
  "password": "t2004"
}
```

### Response

```json
{
  "id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
  "password": "$2b$10$oa0Su2Ne3WB0TSb3I5ihROFqr6Kuc1RF8PYnZ908MdzjEE6wo.3Uy",
  "first_name": "Sanya",
  "last_name": "Lopez",
  "email": "tinesarkiv@gmail.com",
  "gender": null,
  "phone_number": null,
  "badges": null,
  "is_public": true,
  "created_at": "2025-06-13T10:28:20.692Z",
  "updated_at": "2025-06-13T10:28:20.692Z"
}
```

## POST /api/auth/logout

Logs out an authenticated user.

### Request Body

```json
{}
```

### Response

```
Logout successfully.
```

---

# USERS ROUTES

## PUT /api/users/edit-name

Updates the user's first and last name.

### Request Body

```json
{
  "firstName": "Hot Maria",
  "lastName": "Clarra"
}
```

### Response

```json
{
  "message": "Name updated successfully.",
  "user": {
    "id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
    "password": "$2b$10$oa0Su2Ne3WB0TSb3I5ihROFqr6Kuc1RF8PYnZ908MdzjEE6wo.3Uy",
    "first_name": "Hot Maria",
    "last_name": "Clarra",
    "email": "tinesarkiv@gmail.com",
    "gender": null,
    "phone_number": null,
    "badges": null,
    "is_public": true,
    "created_at": "2025-06-13T10:28:20.692Z",
    "updated_at": "2025-06-13T10:28:20.692Z"
  }
}
```

## GET /api/users/

Retrieves the currently authenticated user's profile information.

### Response

```json
{
  "id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
  "password": "$2b$10$oa0Su2Ne3WB0TSb3I5ihROFqr6Kuc1RF8PYnZ908MdzjEE6wo.3Uy",
  "first_name": "Hot Maria",
  "last_name": "Clarra",
  "email": "tinesarkiv@gmail.com",
  "gender": null,
  "phone_number": null,
  "badges": null,
  "is_public": true,
  "created_at": "2025-06-13T10:28:20.692Z",
  "updated_at": "2025-06-13T10:28:20.692Z"
}
```

## PUT /api/users/visibility

Updates the user's profile visibility status.

### Request Body

```json
{
  "visibility": true
}
```

### Response

```json
{
  "message": "Profile visibility updated.",
  "user": {
    "id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
    "password": "$2b$10$oa0Su2Ne3WB0TSb3I5ihROFqr6Kuc1RF8PYnZ908MdzjEE6wo.3Uy",
    "first_name": "Hot Maria",
    "last_name": "Clarra",
    "email": "tinesarkiv@gmail.com",
    "gender": null,
    "phone_number": null,
    "badges": null,
    "is_public": true,
    "created_at": "2025-06-13T10:28:20.692Z",
    "updated_at": "2025-06-13T10:28:20.692Z"
  }
}
```

---

# FLASHCARD ROUTES

## POST /api/flashcard/flashcards

Creates a new set of flashcards for the authenticated user.

### Request Body

```json
{
  "title": "testCard",
  "description": "testing flashcards in postman",
  "flashcards": [
    { "front": "What is the powerhouse of the cell?", "back": "The mitochondria" },
    { "front": "What is the chemical formula for water?", "back": "H2O" }
  ]
}
```

### Response

```json
{
  "id": "6ffde8ee-60bd-4276-a39b-c55570e95340",
  "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
  "title": "testCard",
  "description": "testing flashcards in postman",
  "flashcards": [
    {
      "back": "The mitochondria",
      "front": "What is the powerhouse of the cell?"
    },
    {
      "back": "H2O",
      "front": "What is the chemical formula for water?"
    }
  ],
  "is_public": null,
  "created_at": "2025-06-13T11:34:40.849Z",
  "updated_at": "2025-06-13T11:34:40.849Z",
  "is_ai_generated": false
}
```

## GET /api/flashcard/flashcards/user

Retrieves all flashcards created by the currently authenticated user.

### Response

```json
[
  {
    "id": "6ffde8ee-60bd-4276-a39b-c55570e95340",
    "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
    "title": "testCard",
    "description": "testing flashcards in postman",
    "flashcards": [
      {
        "back": "The mitochondria",
        "front": "What is the powerhouse of the cell?"
      },
      {
        "back": "H2O",
        "front": "What is the chemical formula for water?"
      }
    ],
    "is_public": null,
    "created_at": "2025-06-13T11:34:40.849Z",
    "updated_at": "2025-06-13T11:34:40.849Z",
    "is_ai_generated": false
  }
]
```

## PUT /api/flashcard/flashcards

Updates an existing flashcard set.

### Request Body

```json
{
  "title": "Card Test",
  "description": "Change description",
  "flashcards": [
    {
      "front": "Sino ka ba?",
      "back": "Ako si superman."
    },
    {
      "front": "What sound does a cat make?",
      "back": "meow"
    }
  ],
  "flashcard_id": "6ffde8ee-60bd-4276-a39b-c55570e95340"
}
```

### Response

```json
{
  "id": "6ffde8ee-60bd-4276-a39b-c55570e95340",
  "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
  "title": "Card Test",
  "description": "Change description",
  "flashcards": [
    {
      "back": "Ako si superman.",
      "front": "Sino ka ba?"
    },
    {
      "back": "meow",
      "front": "What sound does a cat make?"
    }
  ],
  "is_public": null,
  "created_at": "2025-06-13T11:34:40.849Z",
  "updated_at": "2025-06-13T11:34:40.849Z",
  "is_ai_generated": false
}
```

## DELETE /api/flashcard/flashcards

Delete an existing flashcard.

### Request Body

```json
{
  "flashcard_id": "6ffde8ee-60bd-4276-a39b-c55570e95340"
}
```

### Response

```json
{
  "message": "Deleted flashcard."
}
```

---

# QUIZ ROUTES

## POST /api/quiz/quiz

Creates a new quiz with multiple questions and answers.

### Request Body

```json
{
  "title": "Test Quiz",
  "description": "This is a test",
  "quiz_content": [
    {
      "question": "What is 2 + 3?",
      "answers": ["3", "4", "5", "6"],
      "correct_answer_index": 2
    },
    {
      "question": "What is 1+10?",
      "answers": ["3", "11", "6", "5"],
      "correct_answer_index": 1
    }
  ]
}
```

### Response

```json
{
  "id": "5e16cda1-c5da-4253-8a3a-61ce15f33ff2",
  "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
  "quiz_content": [
    {
      "answers": ["3", "4", "5", "6"],
      "question": "What is 2 + 3?",
      "correct_answer_index": 2
    },
    {
      "answers": ["3", "11", "6", "5"],
      "question": "What is 1+10?",
      "correct_answer_index": 1
    }
  ],
  "title": "Test Quiz",
  "description": "This is a test",
  "is_public": null,
  "created_at": "2025-06-13T11:51:15.538Z",
  "updated_at": "2025-06-13T11:51:15.538Z",
  "is_ai_generated": false
}
```

## GET /api/quiz/quiz/user

Retrieves all quizzes created by the logged-in user.

### Response

```json
[
  {
    "id": "50414b76-f6e3-48cc-a69c-c82a1577c5fd",
    "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
    "quiz_content": {
      "answers": ["3", "4", "5", "6"],
      "question": "What is 2 + 2?",
      "correct_answer_index": 1
    },
    "title": "Simple Math Quiz",
    "description": "This is a basic quiz on addition and subtraction.",
    "is_public": null,
    "created_at": "2025-06-13T11:47:44.594Z",
    "updated_at": "2025-06-13T11:47:44.594Z",
    "is_ai_generated": false
  },
  {
    "id": "5e16cda1-c5da-4253-8a3a-61ce15f33ff2",
    "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
    "quiz_content": [
      {
        "answers": ["3", "4", "5", "6"],
        "question": "What is 2 + 3?",
        "correct_answer_index": 2
      },
      {
        "answers": ["3", "11", "6", "5"],
        "question": "What is 1+10?",
        "correct_answer_index": 1
      }
    ],
    "title": "Test Quiz",
    "description": "This is a test",
    "is_public": null,
    "created_at": "2025-06-13T11:51:15.538Z",
    "updated_at": "2025-06-13T11:51:15.538Z",
    "is_ai_generated": false
  }
]
```

---

# POST ROUTES

## GET /api/post/posts/user

Retrieves all user posts.

### Response Body

```json
[
  {
    "id": "3226f4e7-db98-48d1-8ecc-e21479696b1f",
    "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
    "post_body": "Hello world",
    "created_at": "2025-06-13T12:21:34.903Z",
    "updated_at": "2025-06-13T12:21:34.903Z",
    "is_public": true
  },
  {
    "id": "e40bd3cd-97c8-4227-9066-63eb9d0d639d",
    "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
    "post_body": "Miga pwede ba nako makita imong code kay naa koy sakit",
    "created_at": "2025-06-13T12:23:48.808Z",
    "updated_at": "2025-06-13T12:23:48.808Z",
    "is_public": true
  }
]
```

## POST /api/post/posts

Create a post on forum.

### Request body

```json
{
  "body": "Hi oieh, si joma diay neh"
}
```

### Response

```json
{
  "id": "c2ef2452-aa49-402f-95a1-4c5847737776",
  "user_id": "2d954e50-a2e6-4e70-bee8-cfd20625682d",
  "post_body": "Hi oieh, si joma diay neh",
  "created_at": "2025-06-13T12:24:56.805Z",
  "updated_at": "2025-06-13T12:24:56.805Z",
  "is_public": true
}
```

---

# AI ROUTES

## POST /api/ai/generate-flashcards-from-prompt

Generates flashcards from prompt.

### Request Body

```json
{
  "prompt": "Create a flashcard set about web development in HTML, CSS, and JavaScript."
}
```

### Response

````json
{
  "content": "```json\n[\n  {\n    \"front\": \"What does HTML stand for?\",\n    \"back\": \"HyperText Markup Language\"\n  },\n  {\n    \"front\": \"What is the purpose of HTML?\",\n    \"back\": \"To structure the content of a web page (headings, paragraphs, images, etc.)\"\n  },\n  {\n    \"front\": \"What does CSS stand for?\",\n    \"back\": \"Cascading Style Sheets\"\n  },\n  {\n    \"front\": \"What is the purpose of CSS?\",\n    \"back\": \"To style the visual presentation of a web page (colors, fonts, layout, etc.)\"\n  },\n  {\n    \"front\": \"What does JavaScript do?\",\n    \"back\": \"Adds interactivity and dynamic behavior to a web page.\"\n  },\n  {\n    \"front\": \"What HTML tag is used to define a heading?\",\n    \"back\": \"<h1> to <h6>\"\n  },\n  {\n    \"front\": \"What is the CSS property used to change the text color?\",\n    \"back\": \"color\"\n  },\n  {\n    \"front\": \"How do you link an external CSS stylesheet to an HTML document?\",\n    \"back\": \"<link rel=\\\"stylesheet\\\" href=\\\"style.css\\\">\"\n  },\n  {\n    \"front\": \"How do you embed JavaScript code directly within an HTML document?\",\n    \"back\": \"<script> // JavaScript code here </script>\"\n  },\n  {\n    \"front\": \"What is a CSS selector?\",\n    \"back\": \"A pattern used to select HTML elements to style.\"\n  },\n   {\n    \"front\": \"Name 3 commonly used HTML semantic tags\",\n    \"back\": \"<article>, <aside>, <nav>, <header>, <footer>, <section>\"\n  },\n  {\n    \"front\": \"What is the DOM?\",\n    \"back\": \"Document Object Model: A programming interface for HTML and XML documents. It represents the page so programs can change the document structure, style and content.\"\n  },\n  {\n    \"front\": \"What is the purpose of the `<meta>` tag in HTML?\",\n    \"back\": \"Provides metadata about the HTML document, such as character set, description, keywords, author, and viewport settings.\"\n  }\n]\n```"
}
````