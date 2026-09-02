import type {
  PlannerAnswers,
  PlannerQuestion,
  PlannerResult,
  RecommendationMatch,
  ServiceBranch,
} from '../types/servicePlanner.types';
import type { PlannerEstimate } from '../types/servicePlanner.types';

export const getAnswerLabels = (
  questions: PlannerQuestion[],
  answers: PlannerAnswers,
) => questions.flatMap(question => {
  const answer = answers[question.id];
  if (answer === undefined || answer === null || answer === '') return [];
  const rawValues = Array.isArray(answer) ? answer : [answer];
  const labels = rawValues.map(value =>
    question.options?.find(candidate => candidate.id === String(value))?.label ?? String(value),
  );
  return [{ question: question.title, labels }];
});

export const buildProjectSummary = (
  branch: ServiceBranch,
  answers: PlannerAnswers,
  match: RecommendationMatch,
  estimate: PlannerEstimate,
): PlannerResult => {
  const answerLabels = getAnswerLabels(branch.questions, answers);
  const firstAnswer = answers[branch.questions[0].id];
  const projectType = Array.isArray(firstAnswer) ? firstAnswer[0] : String(firstAnswer || 'to-be-defined');
  const selectedFeatures = branch.questions.flatMap(question => {
    const answer = answers[question.id];
    return question.inputType === 'multi-select' && Array.isArray(answer) ? answer : [];
  });
  const selectedAddOns = branch.questions.flatMap(question => {
    const answer = answers[question.id];
    const selected = Array.isArray(answer) ? answer : typeof answer === 'string' ? [answer] : [];
    return question.options?.filter(candidate => candidate.tags?.includes('add-on') && selected.includes(candidate.id)).map(candidate => candidate.id) ?? [];
  });
  const assumptions = [
    'This direction is preliminary and will be confirmed after a project review.',
    estimate.customScopeRequired
      ? 'A human scope review is required before timeline and investment can be confirmed.'
      : 'The range assumes timely feedback and access to the selected content and systems.',
  ];
  const answerSummary = answerLabels
    .slice(0, 8)
    .map(item => `${item.question}: ${item.labels.join(', ')}`)
    .join('\n');
  const summary = [
    `${branch.shortTitle} — ${match.recommendation.title}`,
    match.recommendation.description,
    answerSummary,
    estimate.timelineWeeks ? `Typical timeline: ${estimate.timelineWeeks[0]}–${estimate.timelineWeeks[1]} weeks` : '',
    estimate.investmentRange ? `Preliminary investment: $${estimate.investmentRange[0].toLocaleString()}–$${estimate.investmentRange[1].toLocaleString()}` : 'Investment: custom scope required',
  ].filter(Boolean).join('\n\n');

  return {
    branchId: branch.id,
    answers,
    recommendationId: match.recommendation.id,
    recommendationTitle: match.recommendation.title,
    confidence: match.confidence,
    complexity: match.recommendation.complexity,
    projectType,
    selectedFeatures,
    selectedAddOns,
    estimatedTimelineWeeks: estimate.timelineWeeks,
    estimatedInvestmentRange: estimate.investmentRange,
    assumptions,
    followUpRequired: estimate.customScopeRequired || match.confidence === 'low',
    summary,
  };
};
