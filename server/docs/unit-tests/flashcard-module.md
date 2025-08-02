Unit tests for Flashcard Module

---

# August 1-2, 2025

**TL;DR**
✅ All controllers and services in flashcards are impelmented properly.

<details><summary>
<strong>FULL REPORT</strong>
</summary>

## flashcard.controller.ts - PASSED ✅

**Result:**

```
 PASS  tests/flashcard/flashcard.controller.test.ts (6.388 s)
  Flashcard Controller
    get_user_flashcards
      √ should return 401 if user is unauthorized (7 ms)
      √ should return 200 and user's flashcard if successful (2 ms)
      √ should return 500 if there is an error getting user's flashcards (1 ms)
    get_user_flashcard
      √ should return 400 if no flashcard id (1 ms)
      √ should return 404 if flashcard is not found (1 ms)
      √ should return 200 if flashcard is found (1 ms)
      √ should return 500 if there is an error in getting user's flashcard (2 ms)
    create_user_flashcard
      √ should return 400 if invalid input (5 ms)
      √ should return 401 if user is not authenticated (3 ms)
      √ should return 201 if flashcard is created successfully (3 ms)
      √ should return 500 if service throws (1 ms)
    update_user_flashcard
      √ should return 400 if input is invalid (2 ms)
      √ should return 401 if user is not authenticated (1 ms)
      √ should return 500 if update service throws (2 ms)
      √ should return 200 and updated flashcard if successful (2 ms)
    delete_user_flashcard
      √ should return 400 if flashcard_id is missing (1 ms)
      √ should return 200 if deletion is successful (1 ms)
      √ should return 500 if deletion throws an error (1 ms)
    toggle_flashcard_visibility
      √ should return 400 if flashcard_id is missing (1 ms)
      √ should return 200 if visibility is toggled successfully (1 ms)
      √ should return 500 if toggle service throws an error (2 ms)

Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        6.57 s
```

**Feedback:** All flashcard controllers are properly implemented with strict error handling.

## flashcard.service.ts - PASSED ✅

**Result:**

```
 PASS  tests/flashcard/flashcard.service.test.ts
  Flashcard Service
    getUserFlashcards
      √ should return all flashcards owned by user (7 ms)
      √ should throw an error if fetching flashcards fails (18 ms)
    getUserFlashcard
      √ should return a specific flashcard owned by user (2 ms)
      √ should throw an error if flashcard is not found (2 ms)
    createUserFlashcard
      √ should create a new flashcard object data (1 ms)
      √ should throw an error if creation fails (2 ms)
    updateUserFlashcard
      √ should update a flashcard object (1 ms)
      √ should throw an error if update fails (2 ms)
    deleteUserFlashcard
      √ should delete a flashcard (2 ms)
      √ should throw an error if deletion fails (2 ms)
    toggleFlashcardVisibility
      √ should change flashcard's visibility from true to false (2 ms)
      √ should change flashcard's visibility from false to true (1 ms)
      √ should throw an error if changing visibility fails (2 ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        4.11 s, estimated 7 s
```

**Feedback:**

All implemented services for flashcard functions properly, with proper semantics.

</details>
