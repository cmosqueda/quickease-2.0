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
 * Iterates through each answer and increments the score if the user's answer matches the correct answer(s).
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
 * @param unit - The time unit being changed ("hours", "minutes", or "seconds").
 * @param value - The new value for the specified time unit as a string.
 * @param totalSeconds - The current total time in seconds.
 * @param setTotalSeconds - State setter function to update the total seconds.
 *
 * @remarks
 * - Ensures the numeric value is non-negative.
 * - Parses the current total seconds into hours, minutes, and seconds, then updates the relevant unit.
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
