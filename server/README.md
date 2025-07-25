# QuickEase 2.0

This directory serves the server-side of our project named QuickEase 2.0, rewritten from scratch using Fastify + Postgres + Prisma

## FAQs

1. Why did you rewrite the entire back-end?
   Kay kapoy mu-basa og laing source code nga walay halos documentations.

2. When trying to run the `npm run dev` command, it throws an error which says `Error: Cannot find module '@modelcontextprotocol/sdk/types.js'`.
   Solution is to install the missing module by running the `npm install @modelcontextprotocol/sdk` command.

3. When trying to run the `npm i` or `npm install` command, it throws an error that says something about package dependencies conflict on their versions.
   Solution is to install the modules by adding the `--force-legacy-deps` parameter, if it still won't install then contact the developer `(Jhon Lloyd Viernes)`

## Initializing @/server

**Requirements**

- PostgreSQL installed
- Postman installed (if testing)
- Make sure that the tables on your database schema is empty as Prisma will automatically generate it for you.
- Initialize the environment variables

```
JWT_SECRET_KEY: string
COOKIE_SECRET_KEY: string
DATABASE_URL : string -> example = "postgresql://postgres:dlord213@localhost:5432/postgres?schema=public"
GOOGLE_GEN_AI_API_KEY: string
CORS_FRONTEND_HOST: string -> (default) = "http://localhost:5173"
NODEMAILER_GMAIL_APP_PASSWORD (for development only): string
NODEMAILER_GMAIL_USER: string
```

```
In chronological order
1. Install the modules by running the npm i command.
2. Push the migrations on your database by running the npx prisma db push command
3. Check if the tables are created on your PostgreSQL (by opening pgAdmin? or anything similar that'll let you check the database schema)
4. Run the npm run dev command.
5. Server initialized, check its port. (3000 = default port)
```

## Libraries used

`Fastify and its extensions/plugins (@fastify-jwt/fastify-env), PostgreSQL, Prisma`

## Coding rules

1. Creating functions in controllers & services
   To differentiate the functions at controllers & services, use snake_case for creating controllers functions & camelCase for creating services functions. For parameters, use snake_case both on controllers & services.

   ```
   Example for creating controller function
   @/modules/user/user.controller.ts

   async function get_user({request: FastifyRequest, reply: FastifyReply}) {}
   ```

   ```
   Example for creating service function
   @/modules/user/user.service.ts

   async function getUser({user} : {user: string}) {}
   ```

2. Please avoid using migrating commands or anything similar to migration on Prisma
   Contact your main developer `Jhon Lloyd Viernes` and let him handle it.

3. Avoid modifying configuration files.
   To ensure that the server-side is working properly, please avoid modifying configuration files or contact the main developer. `(Jhon Lloyd Viernes)`

   ```
    Files to avoid.
    @/prisma/schema.prisma
    @/utils/ai.ts
    @/utils/client.ts
    @/types/types.ts (unless you know what you're doing)
    @/auth/*.ts (unless you know what you're doing)
    @/fastify.config.ts
    @/server.ts
   ```

## Generating client for database using Prisma

1. Make sure that the `@/prisma/` directory/folder has migrations.

```
@/prisma/migrations
| -> TIMESTAMP_migration-name
  | -> migration.sql
```

2. Push the migration using the `npx prisma db push` command.

3. Generate the prisma client using the `npx prisma generate` command.

## Configuring local PostgreSQL database

1. Create a `.env` file in the root directory.
2. Create a new variable named `DATABASE_URL`.
3. Input your PostgreSQL host and make sure to put it in double quote.

```
Example:
DATABASE_URL="postgresql://postgres:dlord213@localhost:5432/postgres?schema=public"
```

4. Make sure your selected schema tables is empty, Prisma will automatically handle it.
5. Push the latest migration changes using `npx prisma db push` command.
6. Generate the prisma client using the `npx prisma generate` command.

## Environment Variables

- `JWT_SECRET_KEY` is for the secret key used in JWT. (self-explanatory tbh lol)
- `COOKIE_SECRET_KEY` is for the secret key used in cookies. (self-explanatory gyapon lol)
- `DATABASE_URL` is for the database configuration mainly used in Prisma/PostgreSQL.
- `GOOGLE_GEN_AI_API_KEY` is for `@google/gen-ai` API key used to generate AI-generated contents.

## Database Schema Model (June 12, 2025)

Below is the schema model for each tables in Prisma (in case of losing schemas in Prisma)

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "./client/"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  password     String
  first_name   String
  last_name    String
  email        String   @unique
  gender       String?
  phone_number String?
  badges       Json?
  is_public    Boolean  @default(true)
  created_at   DateTime @default(now())
  updated_at   DateTime @default(now())

  flashcards           Flashcard[]
  notes                Note[]
  quizzes              Quiz[]
  posts                Post[]
  comments             Comment[]
  postVotes            PostVote[]
  commentVotes         CommentVote[]
  quizAttempts         QuizAttempt[]
  activityLogsReceived UserActivityLog[] @relation("ReceivedLogs")
  activityLogsSent     UserActivityLog[] @relation("SentLogs")
  forumReports         Report[]          @relation("ReportsByUser")
}

model Flashcard {
  id              String   @id @default(uuid())
  user            User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  user_id         String
  title           String
  description     String?
  flashcards      Json
  is_public       Boolean?
  created_at      DateTime @default(now())
  updated_at      DateTime @default(now())
  is_ai_generated Boolean? @default(false)

  attachments PostAttachment[]
}

model Note {
  id              String   @id @default(uuid())
  user            User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  user_id         String
  title           String
  notes_content   String
  is_public       Boolean?
  created_at      DateTime @default(now())
  updated_at      DateTime @default(now())
  is_ai_generated Boolean? @default(false)
}

model Quiz {
  id              String   @id @default(uuid())
  user            User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  user_id         String
  quiz_content    Json
  title           String
  description     String?
  is_public       Boolean?
  created_at      DateTime @default(now())
  updated_at      DateTime @default(now())
  is_ai_generated Boolean? @default(false)

  attachments PostAttachment[]
  attempts    QuizAttempt[]
}

model Tag {
  id         String   @id @default(uuid())
  tag_name   String   @unique
  created_at DateTime @default(now())

  posts PostTag[]
}

model Post {
  id         String   @id @default(uuid())
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  user_id    String
  post_body  String
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  is_public  Boolean  @default(true)

  tags        PostTag[]
  comments    Comment[]
  votes       PostVote[]
  attachments PostAttachment[]
}

model PostTag {
  tag_id  String
  post_id String

  tag  Tag  @relation(fields: [tag_id], references: [id], onDelete: Cascade)
  post Post @relation(fields: [post_id], references: [id], onDelete: Cascade)

  @@id([tag_id, post_id])
}

model Comment {
  id                String    @id @default(uuid())
  parent_comment_id String?
  parent_comment    Comment?  @relation("CommentReplies", fields: [parent_comment_id], references: [id], onDelete: Cascade)
  replies           Comment[] @relation("CommentReplies")

  post         Post     @relation(fields: [post_id], references: [id], onDelete: Cascade)
  post_id      String
  user         User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  user_id      String
  comment_body String
  created_at   DateTime @default(now())
  updated_at   DateTime @default(now())

  votes CommentVote[]
}

model PostVote {
  user_id   String
  post_id   String
  vote_type Int

  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  post Post @relation(fields: [post_id], references: [id], onDelete: Cascade)

  @@id([user_id, post_id])
}

model CommentVote {
  user_id    String
  comment_id String
  vote_type  Int

  user    User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  comment Comment @relation(fields: [comment_id], references: [id], onDelete: Cascade)

  @@id([user_id, comment_id])
}

model PostAttachment {
  id            String     @id @default(uuid())
  post          Post       @relation(fields: [post_id], references: [id], onDelete: Cascade)
  post_id       String
  resource_type String
  flashcard     Flashcard? @relation(fields: [flashcard_id], references: [id], onDelete: Cascade)
  flashcard_id  String?
  quiz          Quiz?      @relation(fields: [quizzes_id], references: [id], onDelete: Cascade)
  quizzes_id    String?
  created_at    DateTime   @default(now())
  updated_at    DateTime   @default(now())
}

model QuizAttempt {
  id           String    @id @default(uuid())
  quiz         Quiz      @relation(fields: [quiz_id], references: [id], onDelete: Cascade)
  quiz_id      String
  user         User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  user_id      String
  started_at   DateTime
  completed_at DateTime?
  time_taken   String? // store as ISO string or raw interval string
  answer_data  Json
  is_public    Boolean   @default(false)
}

model Report {
  id                   String   @id @default(uuid())
  reported_by          User     @relation("ReportsByUser", fields: [reported_by_id], references: [id], onDelete: Cascade)
  reported_by_id       String
  description          String
  reported_target_type String
  reported_at          DateTime @default(now())
  reported_target_id   String
}

model UserActivityLog {
  id                String   @id @default(uuid())
  recipient         User     @relation("ReceivedLogs", fields: [recipient_user_id], references: [id], onDelete: Cascade)
  recipient_user_id String
  actor             User     @relation("SentLogs", fields: [actor_user_id], references: [id], onDelete: Cascade)
  actor_user_id     String
  activity_type_id  String
  activity_type     String
  message           String
  is_read           Boolean  @default(false)
  created_at        DateTime @default(now())
}
```

## Database Create Table SQL Query (June 8, 2025)

Below is the query text for creating tables in PostgreSQL (in case of losing schemas in Prisma)

```
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
 password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    phone_number VARCHAR(15),
    badges JSONB,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE flashcards (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    flashcards JSONB NOT NULL,
 is_public BOOLEAN,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE note (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes_content TEXT NOT NULL,
 is_public BOOLEAN,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE quizzes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_content JSONB NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
 is_public BOOLEAN,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tags (
    id UUID PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE post_tags (
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (tag_id, post_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE post_votes(
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
 vote_type INT NOT NULL CHECK (vote_type IN (1, -1)),
 PRIMARY KEY (user_id, post_id)
);

CREATE TABLE comment_votes(
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
 vote_type INT NOT NULL CHECK (vote_type IN (1, -1)),
 PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE post_attachments (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('notes', 'flashcards')),
 flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
 quizzes_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE shared_quiz_attempts (
    id UUID PRIMARY KEY,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    time_taken INTERVAL,
    answer_data JSONB NOT NULL
);


CREATE TABLE forum_reports (
    id UUID PRIMARY KEY,
    reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    reported_target_type VARCHAR(20) NOT NULL CHECK (reported_target_type IN ('post', 'comment')),
    reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reported_target_id UUID NOT NULL
);


CREATE TABLE user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type_id UUID NOT NULL,
  activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('post', 'comment')),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Changes/suggestions made by Mosqueda

1. In server/modules/auth/auth.routes.ts/authRoutes, added forward slash for each route:

"login" => "/login"
"register" => "/register"
"logout" => "/logout"

2. In server/modules/auth/auth.service.ts/loginUser, modified arguments at

const isValid = await verifyPassword(password, user.password) to => verifyPassword(email, password)

It should accept email for first argument and password for second argument

3. In server/modules/user/user.routes.ts/userRoutes, added forward slash for each route:

"edit-name" => "/edit-name"
"visibility" => "/visibility"

4. (Question) Kani sa quiz services ug controller dok => create_user_quiz function, pag mag create ug quizzes kay one object ra dawaton para sa quiz_content?

diri na part:

const { title, description, quiz_content } = request.body as {
title: string;
description: string;
quiz_content: { answers: string[]; question: string; correct_answer_index: number };
};

(Update) ay akoa ra gi butngan [] sa every quiz_content argument sa services ug controller dok

5. Sa ai.routes.ts, gi dugangan gyapun nako forward slash ang every routes.

6. Sa mga controllers dok kay nabutngan nakog await statement sa uban functions para ma test sa postman.

7. Sa ai content generation services, pwede maka suggest ani na functions dok?

- generate summary notes from text input (or prompt)
