import { useCallback, useMemo, useState } from 'react';
import { getServiceBranch } from '../config/serviceBranches';
import { buildProjectSummary } from '../engine/buildProjectSummary';
import { calculateEstimate } from '../engine/calculateEstimate';
import { calculateRecommendation } from '../engine/calculateRecommendation';
import { getNextQuestion } from '../engine/getNextQuestion';
import { cleanHiddenAnswers, getVisibleQuestions } from '../engine/getVisibleQuestions';
import type {
  PlannerAnswer,
  PlannerAnswers,
  PlannerQuestion,
  ServiceBranchId,
} from '../types/servicePlanner.types';

const hasAnswer = (question: PlannerQuestion | undefined, answer: PlannerAnswer | undefined) => {
  if (!question?.required) return true;
  if (answer === undefined || answer === null || answer === '') return false;
  if (Array.isArray(answer)) return answer.length > 0;
  if (typeof answer === 'string' && question.validation?.minLength) {
    return answer.trim().length >= question.validation.minLength;
  }
  return true;
};

export const useServicePlanner = () => {
  const [branchId, setBranchId] = useState<ServiceBranchId | null>(null);
  const [answers, setAnswers] = useState<PlannerAnswers>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const branch = branchId ? getServiceBranch(branchId) : undefined;
  const visibleQuestions = useMemo(
    () => branch ? getVisibleQuestions(branch.questions, answers) : [],
    [branch, answers],
  );
  const currentQuestion = visibleQuestions.find(question => question.id === currentQuestionId);
  const currentIndex = currentQuestion
    ? visibleQuestions.findIndex(question => question.id === currentQuestion.id)
    : -1;
  const progress = visibleQuestions.length
    ? Math.round((((showSummary ? visibleQuestions.length : currentIndex + 1) / visibleQuestions.length) * 100))
    : 0;
  const canGoNext = hasAnswer(currentQuestion, currentQuestion ? answers[currentQuestion.id] : undefined);

  const recommendation = useMemo(
    () => branch ? calculateRecommendation(branch.recommendations, answers) : undefined,
    [branch, answers],
  );
  const estimate = useMemo(
    () => branch && recommendation
      ? calculateEstimate(recommendation.recommendation, visibleQuestions, answers)
      : undefined,
    [branch, recommendation, visibleQuestions, answers],
  );
  const result = useMemo(
    () => branch && recommendation && estimate
      ? buildProjectSummary(branch, answers, recommendation, estimate)
      : undefined,
    [branch, answers, recommendation, estimate],
  );

  const selectBranch = useCallback((nextBranchId: ServiceBranchId) => {
    const nextBranch = getServiceBranch(nextBranchId);
    setBranchId(nextBranchId);
    setAnswers({});
    setCurrentQuestionId(nextBranch.questions[0]?.id ?? null);
    setShowSummary(false);
  }, []);

  const answerQuestion = useCallback((questionId: string, answer: PlannerAnswer) => {
    if (!branch) return;
    setAnswers(previous => cleanHiddenAnswers(branch.questions, { ...previous, [questionId]: answer }));
  }, [branch]);

  const goNext = useCallback(() => {
    if (!branch || !currentQuestion || !canGoNext) return;
    const next = getNextQuestion(branch.questions, currentQuestion.id, answers);
    if (next) setCurrentQuestionId(next.id);
    else setShowSummary(true);
  }, [answers, branch, canGoNext, currentQuestion]);

  const goBack = useCallback(() => {
    if (showSummary) {
      setShowSummary(false);
      setCurrentQuestionId(visibleQuestions[visibleQuestions.length - 1]?.id ?? null);
      return;
    }
    if (currentIndex > 0) setCurrentQuestionId(visibleQuestions[currentIndex - 1].id);
  }, [currentIndex, showSummary, visibleQuestions]);

  const resetPlanner = useCallback(() => {
    setBranchId(null);
    setAnswers({});
    setCurrentQuestionId(null);
    setShowSummary(false);
  }, []);

  const completePlanner = useCallback(() => result, [result]);

  return {
    branch,
    currentQuestion,
    answers,
    visibleQuestions,
    currentIndex,
    progress,
    recommendation,
    estimate,
    result,
    showSummary,
    canGoNext,
    selectBranch,
    answerQuestion,
    goBack,
    goNext,
    resetPlanner,
    completePlanner,
  };
};
