import type {
  PlannerAnswers,
  PlannerEstimate,
  PlannerQuestion,
  ServiceRecommendation,
} from '../types/servicePlanner.types';

const addRange = (base: [number, number], impact?: [number, number]): [number, number] =>
  impact ? [base[0] + impact[0], base[1] + impact[1]] : base;

export const calculateEstimate = (
  recommendation: ServiceRecommendation,
  questions: PlannerQuestion[],
  answers: PlannerAnswers,
): PlannerEstimate => {
  let timeline = recommendation.baseTimelineWeeks;
  let investment = recommendation.baseInvestmentRange;

  questions.forEach(question => {
    const answer = answers[question.id];
    const selected = Array.isArray(answer) ? answer : typeof answer === 'string' ? [answer] : [];
    question.options?.forEach(candidate => {
      if (!selected.includes(candidate.id)) return;
      timeline = addRange(timeline, candidate.timelineImpactWeeks);
      if (investment) investment = addRange(investment, candidate.investmentImpact);
    });
  });

  timeline = [Math.max(1, timeline[0]), Math.max(2, timeline[1])];
  const liveProduction = Boolean(answers['motion-live-production']);
  const customScopeRequired = Boolean(recommendation.requiresReview || liveProduction);

  return {
    timelineWeeks: timeline,
    investmentRange: customScopeRequired ? undefined : investment,
    customScopeRequired,
  };
};
