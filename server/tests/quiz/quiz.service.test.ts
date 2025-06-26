import * as quizService from "../../modules/quiz/quiz.service";
import db_client from "../../utils/client";

jest.mock("../../utils/client", () => ({
  __esModule: true,
  default: {
    quiz: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    quizAttempt: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const mockQuiz = {
  id: "quiz-1",
  title: "Sample Quiz",
  description: "A sample quiz",
  quiz_content: [
    {
      question: "What is 2 + 2?",
      description: "A basic math question",
      options: ["1", "2", "3", "4"],
      correctAnswers: [3],
    },
  ],
  is_randomized: false,
  timed_quiz: 30,
  user_id: "user-1",
  is_public: false,
};

describe("Quiz Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUserQuizzes should return quizzes by user ID", async () => {
    (db_client.quiz.findMany as jest.Mock).mockResolvedValue([mockQuiz]);

    const result = await quizService.getUserQuizzes("user-1");
    expect(result).toEqual([mockQuiz]);
    expect(db_client.quiz.findMany).toHaveBeenCalledWith({
      where: { user_id: "user-1" },
    });
  });

  test("getQuiz should return quiz with attempts", async () => {
    const mockQuizWithAttempts = { ...mockQuiz, attempts: [] };
    (db_client.quiz.findUnique as jest.Mock).mockResolvedValue(mockQuizWithAttempts);

    const result = await quizService.getQuiz("quiz-1");
    expect(result).toEqual(mockQuizWithAttempts);
    expect(db_client.quiz.findUnique).toHaveBeenCalledWith({
      where: { id: "quiz-1" },
      include: { attempts: true },
    });
  });

  test("createUserQuiz should create and return a quiz", async () => {
    (db_client.quiz.create as jest.Mock).mockResolvedValue(mockQuiz);

    const result = await quizService.createUserQuiz(
      mockQuiz.title,
      mockQuiz.description,
      mockQuiz.quiz_content,
      mockQuiz.is_randomized,
      mockQuiz.timed_quiz,
      mockQuiz.user_id
    );

    expect(result).toEqual(mockQuiz);
    expect(db_client.quiz.create).toHaveBeenCalledWith({
      data: {
        title: mockQuiz.title,
        description: mockQuiz.description,
        quiz_content: mockQuiz.quiz_content,
        is_randomized: mockQuiz.is_randomized,
        timed_quiz: mockQuiz.timed_quiz,
        user_id: mockQuiz.user_id,
      },
    });
  });

  test("updateUserQuiz should update and return quiz", async () => {
    (db_client.quiz.update as jest.Mock).mockResolvedValue(mockQuiz);

    const result = await quizService.updateUserQuiz(
      mockQuiz.title,
      mockQuiz.description,
      mockQuiz.quiz_content,
      mockQuiz.is_randomized,
      mockQuiz.timed_quiz,
      mockQuiz.id
    );

    expect(result).toEqual(mockQuiz);
    expect(db_client.quiz.update).toHaveBeenCalledWith({
      data: {
        title: mockQuiz.title,
        description: mockQuiz.description,
        quiz_content: mockQuiz.quiz_content,
        is_randomized: mockQuiz.is_randomized,
        timed_quiz: mockQuiz.timed_quiz,
      },
      where: { id: mockQuiz.id },
    });
  });

  test("updateUserQuizVisibility should update and return quiz", async () => {
    const updatedQuiz = { ...mockQuiz, is_public: true };
    (db_client.quiz.update as jest.Mock).mockResolvedValue(updatedQuiz);

    const result = await quizService.updateUserQuizVisibility(true, mockQuiz.id);
    expect(result).toEqual(updatedQuiz);
    expect(db_client.quiz.update).toHaveBeenCalledWith({
      data: { is_public: true },
      where: { id: mockQuiz.id },
    });
  });

  test("deleteUserQuiz should delete quiz and return true", async () => {
    (db_client.quiz.delete as jest.Mock).mockResolvedValue({});

    const result = await quizService.deleteUserQuiz(mockQuiz.id);
    expect(result).toBe(true);
    expect(db_client.quiz.delete).toHaveBeenCalledWith({
      where: { id: mockQuiz.id },
    });
  });

  test("submitQuizAttempt should store attempt and return true", async () => {
    (db_client.quizAttempt.create as jest.Mock).mockResolvedValue(true);

    const attemptData = {
      question: {
        question: "Sample Q",
        options: ["a", "b", "c", "d"],
        correctAnswers: [1],
      },
      user_answer: [1],
    };

    const result = await quizService.submitQuizAttempt(
      attemptData,
      "2025-06-01T10:00:00Z",
      "2025-06-01T10:10:00Z",
      "quiz-1",
      "user-1"
    );

    expect(result).toBe(true);
    expect(db_client.quizAttempt.create).toHaveBeenCalledWith({
      data: {
        user_id: "user-1",
        started_at: "2025-06-01T10:00:00Z",
        completed_at: "2025-06-01T10:10:00Z",
        answer_data: attemptData,
        quiz_id: "quiz-1",
      },
    });
  });

  test("getQuizAttempt should return attempt by ID", async () => {
    const mockAttempt = {
      id: "attempt-1",
      quiz_id: "quiz-1",
      user_id: "user-1",
      answer_data: {},
      started_at: "2025-06-01T10:00:00Z",
      completed_at: "2025-06-01T10:10:00Z",
    };

    (db_client.quizAttempt.findUnique as jest.Mock).mockResolvedValue(mockAttempt);

    const result = await quizService.getQuizAttempt("attempt-1");

    expect(result).toEqual(mockAttempt);
    expect(db_client.quizAttempt.findUnique).toHaveBeenCalledWith({
      where: { id: "attempt-1" },
    });
  });
});
