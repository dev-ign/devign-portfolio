import type {
  ConditionGroup,
  PlannerAnswer,
  PlannerAnswers,
  PlannerCondition,
} from '../types/servicePlanner.types';

const hasValue = (answer: PlannerAnswer | undefined) =>
  answer !== undefined &&
  answer !== null &&
  answer !== '' &&
  (!Array.isArray(answer) || answer.length > 0);

const expectedValues = (value: PlannerCondition['value']) =>
  Array.isArray(value) ? value : value === undefined ? [] : [value];

export const evaluateCondition = (
  condition: PlannerCondition,
  answers: PlannerAnswers,
): boolean => {
  const answer = answers[condition.questionId];
  const expected = expectedValues(condition.value);

  if (condition.operator === 'exists') return hasValue(answer);

  if (condition.operator === 'equals' || condition.operator === 'not-equals') {
    const isEqual = Array.isArray(answer)
      ? expected.length === answer.length && expected.every(value => answer.includes(String(value)))
      : expected.some(value => answer === value);
    return condition.operator === 'equals' ? isEqual : !isEqual;
  }

  const selected = Array.isArray(answer) ? answer : hasValue(answer) ? [String(answer)] : [];
  const includes = expected.some(value => selected.includes(String(value)));
  return condition.operator === 'includes' ? includes : !includes;
};

export const evaluateConditions = (
  group: ConditionGroup | undefined,
  answers: PlannerAnswers,
): boolean => {
  if (!group) return true;
  const results = group.conditions.map(condition => evaluateCondition(condition, answers));
  return group.operator === 'and' ? results.every(Boolean) : results.some(Boolean);
};
