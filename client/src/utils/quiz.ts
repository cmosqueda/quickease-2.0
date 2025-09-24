/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from "react";

/**
 * Compares two arrays of numbers to determine if they contain the same elements, regardless of order.
 *
 * @param correct - The array of correct answer indices.
 * @param user - The array of user-selected answer indices.
 * @returns `true` if both arrays contain the same numbers in any order; otherwise, `false`.
 */
export function areAnswersEqual(correct: number[], user: number[]): boolean {
  const sortedCorrect = [...correct].sort();
  const sortedUser = [...user].sort();
  if (sortedCorrect.length !== sortedUser.length) return false;
  return sortedCorrect.every((val, index) => val === sortedUser[index]);
}

/**
 * Calculates the total score based on the user's answers.
 *
 * Iterates through the provided user answers and increments the score for each correct answer.
 * An answer is considered correct if `areAnswersEqual` returns true when comparing the question's correct answers and the user's answer.
 *
 * @param userAnswers - An array of user answer objects, each containing the question and the user's answer.
 * @returns The total score as a number.
 */
export function calculateScore(userAnswers: any[]): number {
  let score = 0;
  for (const answer of userAnswers) {
    if (areAnswersEqual(answer.question.correctAnswers, answer.user_answer)) {
      score += 1;
    }
  }
  return score;
}

/**
 * Calculates the percentage score based on the user's answers.
 *
 * @param userAnswers - An array containing the user's answers.
 * @returns The percentage of correct answers as a number.
 */
export function calculateScorePercentage(userAnswers: any[]): number {
  const total = userAnswers.length;
  const correct = calculateScore(userAnswers);
  return (correct / total) * 100;
}

/**
 * Updates the total time in seconds based on the changed time unit (hours, minutes, or seconds).
 *
 * @param unit - The time unit that was changed ("hours", "minutes", or "seconds").
 * @param value - The new value for the specified time unit as a string.
 * @param totalSeconds - The current total time in seconds.
 * @param setTotalSeconds - A state setter function to update the total seconds.
 */
export const handleTimeChange = (
  unit: string,
  value: string,
  totalSeconds: number,
  setTotalSeconds: Dispatch<SetStateAction<number>>
) => {
  const numericValue = Math.max(0, parseInt(value) || 0);
  const currentHours = Math.floor(totalSeconds / 3600);
  const currentMinutes = Math.floor((totalSeconds % 3600) / 60);
  const currentSeconds = totalSeconds % 60;

  let newTotal = 0;
  if (unit === "hours") {
    newTotal = numericValue * 3600 + currentMinutes * 60 + currentSeconds;
  } else if (unit === "minutes") {
    newTotal = currentHours * 3600 + numericValue * 60 + currentSeconds;
  } else if (unit === "seconds") {
    newTotal = currentHours * 3600 + currentMinutes * 60 + numericValue;
  }

  setTotalSeconds(newTotal);
};

/**
 * Returns the value of a specific time unit (hours, minutes, or seconds) from a total number of seconds.
 *
 * @param unit - The time unit to extract ("hours", "minutes", or "seconds").
 * @param totalSeconds - The total number of seconds to convert.
 * @returns The value of the specified unit extracted from the total seconds.
 *          Returns 0 if the unit is not recognized.
 */
export const getUnitValue = (unit: string, totalSeconds: number) => {
  if (unit === "hours") return Math.floor(totalSeconds / 3600);
  if (unit === "minutes") return Math.floor((totalSeconds % 3600) / 60);
  if (unit === "seconds") return totalSeconds % 60;
  return 0;
};

/**
 * Calculates the correct and incorrect percentages and provides a text-based performance evaluation from a quiz result object.
 * @param {object} data The quiz result data object.
 * @returns {object} An object containing the correct and wrong percentages, along with a performance text.
 */
export const getQuizPercentages = (
  data: any
): {
  correctPercentage: number;
  wrongPercentage: number;
  performanceText: string;
} => {
  const answerData = data?.answer_data;

  if (!answerData || !Array.isArray(answerData) || answerData.length === 0) {
    return {
      correctPercentage: 0,
      wrongPercentage: 0,
      performanceText: "No quiz data available. Please try again.",
    };
  }

  const totalQuestions = answerData.length;
  let correctCount = 0;

  answerData.forEach((answer: any) => {
    const userAnswers = answer.user_answer;
    const correctAnswers = answer.question.correctAnswers;

    if (userAnswers && correctAnswers) {
      const isCorrect =
        JSON.stringify(userAnswers.sort()) ===
        JSON.stringify(correctAnswers.sort());
      if (isCorrect) {
        correctCount++;
      }
    }
  });

  const correctPercentage = (correctCount / totalQuestions) * 100;
  const wrongPercentage = 100 - correctPercentage;

  let performanceText;
  if (correctPercentage === 100) {
    performanceText = "Wow, you got a perfect score! 🤩";
  } else if (correctPercentage >= 80) {
    performanceText = "Great job! You did really well. 👏";
  } else if (correctPercentage >= 60) {
    performanceText = "Good effort! Your score is above average. 😊";
  } else if (correctPercentage >= 40) {
    performanceText = "You're on the right track! Keep studying. 💪";
  } else {
    performanceText = "Keep going! Review the material and try again. 🙏";
  }

  return {
    correctPercentage: parseFloat(correctPercentage.toFixed(2)),
    wrongPercentage: parseFloat(wrongPercentage.toFixed(2)),
    performanceText,
  };
};
