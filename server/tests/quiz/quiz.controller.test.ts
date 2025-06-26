import Fastify from "fastify";
import * as quizService from "../../modules/quiz/quiz.service";
import {
  get_user_quizzes,
  get_quiz,
  create_user_quiz,
  update_user_quiz,
  update_user_quiz_visibility,
  delete_user_quiz,
  submit_quiz_attempt,
} from "../../modules/quiz/quiz.controller";

jest.mock("../../modules/quiz/quiz.service");

const mockQuiz = {
  id: "quiz-1",
  title: "Sample Quiz",
  description: "Sample Description",
  quiz_content: [
    {
      question: "What is 2 + 2?",
      options: ["1", "2", "3", "4"],
      correctAnswers: [3],
    },
  ],
  is_randomized: false,
  timed_quiz: 60,
  user_id: "user-1",
};

describe("Quiz Controller", () => {
  const app = Fastify();

  beforeAll(async () => {
    app.decorateRequest("user", null as any);
    app.addHook("preHandler", async (req: any) => {
      req.user = { id: "user-1" };
    });

    app.get("/quizzes", get_user_quizzes);
    app.get("/quizzes/:quiz_id", get_quiz);
    app.post("/quizzes", create_user_quiz);
    app.put("/quizzes", update_user_quiz);
    app.patch("/quizzes/visibility", update_user_quiz_visibility);
    app.delete("/quizzes", delete_user_quiz);
    app.post("/quizzes/submit", submit_quiz_attempt);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("get_user_quizzes should return 200 with quizzes", async () => {
    (quizService.getUserQuizzes as jest.Mock).mockResolvedValue([mockQuiz]);

    const res = await app.inject({ method: "GET", url: "/quizzes" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([mockQuiz]);
  });

  test("get_quiz should return 200 with a quiz", async () => {
    (quizService.getQuiz as jest.Mock).mockResolvedValue(mockQuiz);

    const res = await app.inject({ method: "GET", url: "/quizzes/quiz-1" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual(mockQuiz);
  });

  test("create_user_quiz should return 201 with created quiz", async () => {
    (quizService.createUserQuiz as jest.Mock).mockResolvedValue(mockQuiz);

    const res = await app.inject({
      method: "POST",
      url: "/quizzes",
      payload: {
        title: "Sample Quiz",
        description: "Sample Description",
        quiz_content: mockQuiz.quiz_content,
        is_randomized: false,
        timed_quiz: 60,
      },
    });

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body)).toEqual(mockQuiz);
  });

  test("update_user_quiz should return 200 on success", async () => {
    (quizService.updateUserQuiz as jest.Mock).mockResolvedValue(mockQuiz);

    const res = await app.inject({
      method: "PUT",
      url: "/quizzes",
      payload: {
        title: "Updated Quiz",
        description: "Updated Description",
        quiz_content: mockQuiz.quiz_content,
        is_randomized: true,
        timed_quiz: 45,
        quiz_id: "quiz-1",
      },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe("Updated quiz.");
  });

  test("update_user_quiz_visibility should return 200 on success", async () => {
    (quizService.updateUserQuizVisibility as jest.Mock).mockResolvedValue(mockQuiz);

    const res = await app.inject({
      method: "PATCH",
      url: "/quizzes/visibility",
      payload: {
        visibility: true,
        quiz_id: "quiz-1",
      },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe("Updated quiz visibility.");
  });

  test("delete_user_quiz should return 200 on success", async () => {
    (quizService.deleteUserQuiz as jest.Mock).mockResolvedValue(true);

    const res = await app.inject({
      method: "DELETE",
      url: "/quizzes",
      payload: {
        quiz_id: "quiz-1",
      },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe("Deleted quiz.");
  });

  test("submit_quiz_attempt should return 200 on success", async () => {
    (quizService.submitQuizAttempt as jest.Mock).mockResolvedValue(true);

    const res = await app.inject({
      method: "POST",
      url: "/quizzes/submit",
      payload: {
        answer_data: {
          question: {
            question: "Sample question",
            options: ["a", "b", "c", "d"],
            correctAnswers: [2],
          },
          user_answer: [2],
        },
        started_at: "2025-06-24T10:00:00Z",
        completed_at: "2025-06-24T10:10:00Z",
        quiz_id: "quiz-1",
      },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).submitted).toBe(true);
  });
});
