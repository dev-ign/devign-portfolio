export type ServiceBranchId =
  | 'websites'
  | 'web-applications'
  | 'branding-marketing'
  | 'motion-video';

export type QuestionInputType =
  | 'single-select'
  | 'multi-select'
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'range';

export type ProjectComplexity = 'foundation' | 'growth' | 'custom';
export type PlannerAnswer = string | string[] | number | boolean | null;

export interface BranchPreview {
  type: 'image' | 'interactive' | 'video';
  idleAsset?: string;
  activeAsset?: string;
  posterAsset?: string;
  alt: string;
  icon?: string;
  accent: string;
}

export interface PlannerCondition {
  questionId: string;
  operator: 'equals' | 'not-equals' | 'includes' | 'not-includes' | 'exists';
  value?: string | string[] | boolean;
}

export interface ConditionGroup {
  operator: 'and' | 'or';
  conditions: PlannerCondition[];
}

export interface QuestionValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  message?: string;
}

export interface PlannerOption {
  id: string;
  label: string;
  shortLabel?: string;
  description?: string;
  icon?: string;
  examples?: string[];
  educationalNote?: string;
  tags?: string[];
  complexityScore?: number;
  timelineImpactWeeks?: [number, number];
  investmentImpact?: [number, number];
  nextQuestionId?: string;
  recommendationSignals?: string[];
}

export interface PlannerQuestion {
  id: string;
  branchId: ServiceBranchId;
  stepLabel: string;
  title: string;
  description?: string;
  educationalNote?: string;
  inputType: QuestionInputType;
  required: boolean;
  options?: PlannerOption[];
  visibility?: ConditionGroup;
  validation?: QuestionValidation;
  maxSelections?: number;
}

export interface RecommendationRule {
  questionId: string;
  operator: 'equals' | 'includes' | 'includes-any';
  value: string | string[];
  score: number;
}

export interface ServiceRecommendation {
  id: string;
  branchId: ServiceBranchId;
  title: string;
  complexity: ProjectComplexity;
  description: string;
  bestFor: string[];
  includedDeliverables: string[];
  possibleAddOns: string[];
  baseTimelineWeeks: [number, number];
  baseInvestmentRange?: [number, number];
  criteria: RecommendationRule[];
  requiresReview?: boolean;
}

export interface ServiceAddOn {
  id: string;
  title: string;
  description: string;
  eligibleProjectTypes?: string[];
  timelineImpactWeeks?: [number, number];
  investmentRange?: [number, number];
}

export interface ServiceBranch {
  id: ServiceBranchId;
  eyebrow: string;
  title: string;
  shortTitle: string;
  description: string;
  prompt: string;
  preview: BranchPreview;
  highlights: string[];
  questions: PlannerQuestion[];
  recommendations: ServiceRecommendation[];
  addOns: ServiceAddOn[];
}

export interface PlannerAnswers {
  [questionId: string]: PlannerAnswer;
}

export interface RecommendationMatch {
  recommendation: ServiceRecommendation;
  score: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface PlannerEstimate {
  timelineWeeks?: [number, number];
  investmentRange?: [number, number];
  customScopeRequired: boolean;
}

export interface PlannerResult {
  branchId: ServiceBranchId;
  answers: PlannerAnswers;
  recommendationId?: string;
  recommendationTitle?: string;
  confidence: 'low' | 'medium' | 'high';
  complexity: ProjectComplexity;
  projectType: string;
  selectedFeatures: string[];
  selectedAddOns: string[];
  estimatedTimelineWeeks?: [number, number];
  estimatedInvestmentRange?: [number, number];
  assumptions: string[];
  followUpRequired: boolean;
  summary: string;
}
