Unit tests for Auth Module

---

# August 1-2, 2025

**TL;DR**

<details>
<summary><strong>FULL REPORT</strong></summary>

## auth.controller.ts -

**Result:**

```


```

**Feedback:**

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
