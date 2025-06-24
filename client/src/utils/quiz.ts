import type { Dispatch, SetStateAction } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function areAnswersEqual(correct: number[], user: number[]): boolean {
    const sortedCorrect = [...correct].sort();
    const sortedUser = [...user].sort();
    if (sortedCorrect.length !== sortedUser.length) return false;
    return sortedCorrect.every((val, index) => val === sortedUser[index]);
}

export function calculateScore(userAnswers: any[]): number {
    let score = 0;
    for (const answer of userAnswers) {
        if (areAnswersEqual(answer.question.correctAnswers, answer.user_answer)) {
            score += 1;
        }
    }
    return score;
}

export function calculateScorePercentage(userAnswers: any[]): number {
    const total = userAnswers.length;
    const correct = calculateScore(userAnswers);
    return (correct / total) * 100;
}

export const handleTimeChange = (unit: string, value: string, totalSeconds: number, setTotalSeconds: Dispatch<SetStateAction<number>>) => {
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

export const getUnitValue = (unit: string, totalSeconds: number) => {
    if (unit === "hours") return Math.floor(totalSeconds / 3600);
    if (unit === "minutes") return Math.floor((totalSeconds % 3600) / 60);
    if (unit === "seconds") return totalSeconds % 60;
    return 0;
};