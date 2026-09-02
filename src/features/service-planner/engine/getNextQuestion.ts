import type { PlannerAnswers, PlannerQuestion } from '../types/servicePlanner.types';
import { getVisibleQuestions } from './getVisibleQuestions';

export const getNextQuestion = (
  questions: PlannerQuestion[],
  currentQuestionId: string,
  answers: PlannerAnswers,
): PlannerQuestion | undefined => {
  const current = questions.find(question => question.id === currentQuestionId);
  const answer = answers[currentQuestionId];
  const selectedIds = Array.isArray(answer) ? answer : typeof answer === 'string' ? [answer] : [];
  const explicitNextId = current?.options
    ?.filter(candidate => selectedIds.includes(candidate.id))
    .map(candidate => candidate.nextQuestionId)
    .find(Boolean);

  const visible = getVisibleQuestions(questions, answers);
  if (explicitNextId) {
    const explicit = visible.find(question => question.id === explicitNextId);
    if (explicit) return explicit;
  }

  const currentIndex = visible.findIndex(question => question.id === currentQuestionId);
  return currentIndex >= 0 ? visible[currentIndex + 1] : visible[0];
};
