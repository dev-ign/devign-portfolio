import type {
  PlannerAnswer,
  PlannerAnswers,
  RecommendationMatch,
  RecommendationRule,
  ServiceRecommendation,
} from '../types/servicePlanner.types';

const values = (value: string | string[]) => Array.isArray(value) ? value : [value];

const matchesRule = (rule: RecommendationRule, answer: PlannerAnswer | undefined) => {
  const expected = values(rule.value);
  if (rule.operator === 'equals') {
    return Array.isArray(answer)
      ? expected.length === answer.length && expected.every(value => answer.includes(value))
      : expected.includes(String(answer));
  }
  const selected = Array.isArray(answer) ? answer : answer == null ? [] : [String(answer)];
  if (rule.operator === 'includes') return expected.every(value => selected.includes(value));
  return expected.some(value => selected.includes(value));
};

export const calculateRecommendation = (
  recommendations: ServiceRecommendation[],
  answers: PlannerAnswers,
): RecommendationMatch => {
  const ranked = recommendations.map(recommendation => ({
    recommendation,
    score: recommendation.criteria.reduce(
      (total, rule) => total + (matchesRule(rule, answers[rule.questionId]) ? rule.score : 0),
      0,
    ),
  })).sort((a, b) => b.score - a.score);

  const winner = ranked[0];
  const runnerUp = ranked[1];
  const difference = winner.score - (runnerUp?.score ?? 0);
  const confidence: RecommendationMatch['confidence'] =
    winner.score === 0 || difference <= 1 ? 'low' : difference >= 5 ? 'high' : 'medium';

  return { ...winner, confidence };
};
