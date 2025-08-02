Unit tests for Auth Module

---

# August 1-2, 2025

**TL;DR**

✅ All services and controllers are properly implemented.

<details>
<summary><strong>FULL REPORT</strong></summary>

## auth.controller.ts - PASSED ✅

**Result:**

```
 PASS  tests/auth/auth.controller.test.ts (8.513 s)
  Auth Controller
    login_user
      √ should return 400 if email or password is missing (7 ms)
      √ should return 400 if credentials are invalid (2 ms)
      √ should return 200 if login is successful (2 ms)
      √ should return 500 on unexpected error (1 ms)
    register_user
      √ should return 400 if any required field is missing (2 ms)
      √ should return 406 if email already exists (1 ms)
      √ should return 201 if registration succeeds (2 ms)
      √ should return 500 on unexpected error (66 ms)
    logout
      √ should clear cookie and return 200 (2 ms)
      √ should return 500 if an error occurs (1 ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        8.835 s

```

**Feedback:** Controllers are properly implemented.

## auth.service.ts - PASSED ✅

**Result:**

```
 PASS  tests/auth/auth.service.test.ts (6.116 s)
  Auth Services
    loginUser
      √ should return user if email and password match (8 ms)
      √ should return false if user is not found (1 ms)
      √ should return false if password does not match
      √ should throw an error if login fails (34 ms)
    registerUser
      √ should create a new user account (1 ms)
      √ should throw an error if registration fails (1 ms)
      √ should throw an error if email is already registered (2 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        6.289 s, estimated 7 s
```

**Feedback:** loginUser and registerUser services are implemented properly

</details>
