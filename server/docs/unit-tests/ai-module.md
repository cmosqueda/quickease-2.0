Unit Tests for AI Module

---

# August 1, 2025

<details>
<summary><strong>TLDR</strong>
## SUMMARY

</summary>

</details>

<details>
<summary><strong>FULL REPORT</strong></summary>

## ai.controller.ts

**Result:**

```
 PASS  tests/ai/ai.controller.test.ts (7.638 s)
  AI Controller - Generate from Prompt
    generate_quiz_from_prompt
      √ should return 200 with quiz content (13 ms)
      √ should return 500 if service throws (5 ms)
    generate_flashcards_from_prompt
      √ should return 200 with flashcard content (9 ms)
      √ should return 500 if service throws (3 ms)
    generate_notes_from_prompt
      √ should return 200 with note HTML content (6 ms)
      √ should return 500 if service throws (1 ms)
  AI Controller - Generate from Note
    generate_quiz_from_note
      √ should return 200 and quiz content from note (2 ms)
      √ should return 500 on service error (5 ms)
    generate_flashcards_from_note
      √ should return 200 and flashcard content from note (1 ms)
      √ should return 500 on service error (2 ms)
  AI Controller - Generate from PDF
    generate_notes_from_pdf
      √ should return summary notes from PDF (3 ms)
      √ should return 500 if summary generation fails (2 ms)
    generate_quiz_from_pdf
      √ should return quiz content from PDF (2 ms)
      √ should return 500 if quiz generation fails (1 ms)
    generate_flashcards_from_pdf
      √ should return flashcards from PDF (1 ms)
      √ should return 500 if flashcard generation fails (2 ms)

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        7.906 s

```

**Feedback:** All controller tested works as expected.

## ai.note.service.ts - PASSED ✅

**Result:**

```
 PASS  tests/ai/ai.note.service.test.ts
  AI Note Services
    generateQuizFromNote
      √ should return a quiz object when note is found (8 ms)
      √ should return undefined if note is not found (2 ms)
    generateFlashcardFromNote
      √ should return flashcards object when note is found (2 ms)
      √ should return undefined if note is not found (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        3.952 s, estimated 4 s

```

**Feedback:** both services worked as expected.

## ai.prompt.service.ts - PARTIAL PASSED ⚠️

**Result:**

```
 FAIL  tests/ai/ai.prompt.service.test.ts
  AI Prompt Services
    generateQuizFromPrompt
      × should return a quiz object when prompt is provided (16 ms)
      √ should return false if an error occurs (1 ms)
    generateFlashcardsFromPrompt
      × should return a flashcard object when prompt is provided (2 ms)
      √ should return false if an error occurs (2 ms)
    generateNotesFromPrompt
      × should return an HTML string of the notes (4 ms)
      √ should return false if an error occurs (1 ms)

---

generateQuizPrompt result:

expected no whitespaces:

-   "content": "[{\"question\":\"What is a variable in Python?\",\"description\":\"Basic knowledge check\",\"options\":[\"Integer\",\"Container\",\"Storage\",\"None of the above\"],\"correctAnswers\":[2]}]",

returned response with a whitespace:

+   "content": "
+ [{\"question\":\"What is a variable in Python?\",\"description\":\"Basic knowledge check\",\"options\":[\"Integer\",\"Container\",\"Storage\",\"None of the above\"],\"correctAnswers\":[2]}]
+ ",

---

generateFlashcardsFromPrompt result:

expected no whitespaces:

-   "content": "[{\"front\":\"What is Python?\",\"back\":\"A high-level programming language.\"},{\"front\":\"Who created Python?\",\"back\":\"Guido van Rossum.\"}]",


returned response with a whitespace:

+   "content": "
+ [{\"front\":\"What is Python?\",\"back\":\"A high-level programming language.\"},{\"front\":\"Who created Python?\",\"back\":\"Guido van Rossum.\"}]
+ ",

---

generateNotesFromPrompt result:

expected no whitespaces,
received response with a whitespace:

<h1 class="text-4xl">Python Basics</h1><ul class="list-disc"><li>Variables</li></ul>
+

```

**Feedback:** Unwanted whitespaces are returned in responses but this is not that serious.

## ai.upload.service.ts - PASSED ✅

**Result:**

```
 PASS  tests/ai/ai.upload.service.test.ts (6.276 s)
  AI Upload Services
    generateSummaryNotesFromPDF
      √ should return parsed summary notes (7 ms)
      √ should return false if Gemini throws error (62 ms)
    generateQuizFromPDF
      √ should return parsed quiz content (1 ms)
      √ should return false on failure (10 ms)
    generateFlashcardsFromPDF
      √ should return parsed flashcard data (1 ms)
      √ should return false on failure (9 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        6.567 s

```

**Feedback:** All upload services passed the test and worked as expected.

</details>
