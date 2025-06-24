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

