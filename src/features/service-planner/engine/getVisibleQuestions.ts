import type { PlannerAnswers, PlannerQuestion } from '../types/servicePlanner.types';
import { evaluateConditions } from './evaluateConditions';

export const getVisibleQuestions = (
  questions: PlannerQuestion[],
  answers: PlannerAnswers,
) => questions.filter(question => evaluateConditions(question.visibility, answers));

export const cleanHiddenAnswers = (
  questions: PlannerQuestion[],
  answers: PlannerAnswers,
): PlannerAnswers => {
  let next = { ...answers };
  let changed = true;

  while (changed) {
    changed = false;
    const visibleIds = new Set(getVisibleQuestions(questions, next).map(question => question.id));
    for (const questionId of Object.keys(next)) {
      if (!visibleIds.has(questionId)) {
        delete next[questionId];
        changed = true;
      }
    }
  }

  return next;
};
