import { brandingMarketingBranch } from '../config/branches/brandingMarketing';
import { motionVideoBranch } from '../config/branches/motionVideo';
import { webApplicationsBranch } from '../config/branches/webApplications';
import { websitesBranch } from '../config/branches/websites';
import { buildProjectSummary } from './buildProjectSummary';
import { calculateEstimate } from './calculateEstimate';
import { calculateRecommendation } from './calculateRecommendation';
import { cleanHiddenAnswers, getVisibleQuestions } from './getVisibleQuestions';

describe('service planner decision engine', () => {
  test('shows website booking follow-ups and removes their answers when the trigger changes', () => {
    const bookingAnswers = {
      'website-type': 'business-website',
      'website-goals': ['generate-inquiries'],
      'website-capabilities': ['appointment-booking'],
      'website-booking-type': 'appointments',
      'website-booking-platform': 'calendly',
    };

    expect(getVisibleQuestions(websitesBranch.questions, bookingAnswers).map(question => question.id))
      .toEqual(expect.arrayContaining(['website-booking-type', 'website-booking-platform']));

    const cleaned = cleanHiddenAnswers(websitesBranch.questions, {
      ...bookingAnswers,
      'website-capabilities': ['inquiry'],
    });
    expect(cleaned['website-booking-type']).toBeUndefined();
    expect(cleaned['website-booking-platform']).toBeUndefined();
  });

  test.each([
    {
      name: 'local service business',
      branch: websitesBranch,
      answers: {
        'website-type': 'business-website',
        'website-stage': 'replace',
        'website-goals': ['generate-inquiries'],
        'website-size': 'two-five',
        'website-capabilities': ['appointment-booking', 'multilingual'],
        'website-content-readiness': 'copywriting',
        'website-brand-readiness': 'guidelines',
        'target-timeline': 'two-three-months',
      },
      expected: 'business-growth-website',
      review: false,
    },
    {
      name: 'software startup',
      branch: webApplicationsBranch,
      answers: {
        'app-type': 'saas',
        'app-users': ['multiple-organizations'],
        'app-stage': 'prototype',
        'app-access': 'organizations',
        'app-account-capabilities': ['role-assignment', 'organization-switching'],
        'app-data': ['charts-and-analytics', 'payment-data', 'notifications'],
        'app-platform': 'responsive-web',
      },
      expected: 'custom-product-platform',
      review: true,
    },
    {
      name: 'trade-show campaign',
      branch: brandingMarketingBranch,
      answers: {
        'brand-support-type': 'event-materials',
        'brand-goal': ['support-an-event'],
        'brand-assets': 'guidelines',
        'brand-deliverables': ['booth-graphics', 'flags-or-banners', 'flyers-or-brochures'],
        'brand-event-readiness': ['dimensions-confirmed', 'printer-selected'],
      },
      expected: 'focused-campaign',
      review: false,
    },
    {
      name: 'product animation',
      branch: motionVideoBranch,
      answers: {
        'motion-type': 'animated-product',
        'motion-objective': 'explain-a-product',
        'motion-format': 'interface-animation',
        'motion-duration': '60-120',
        'motion-support': ['creative-concept', 'scriptwriting', 'storyboarding', 'animation', 'sound-design', 'multiple-aspect-ratios'],
      },
      expected: 'product-story',
      review: false,
    },
  ])('recommends the intended engagement for $name', ({ branch, answers, expected, review }) => {
    const match = calculateRecommendation(branch.recommendations, answers);
    const visible = getVisibleQuestions(branch.questions, answers);
    const estimate = calculateEstimate(match.recommendation, visible, answers);

    expect(match.recommendation.id).toBe(expected);
    expect(estimate.customScopeRequired).toBe(review);
  });

  test('applies option modifiers and produces a normalized, human-readable result', () => {
    const answers = {
      'website-type': 'business-website',
      'website-stage': 'replace',
      'website-goals': ['generate-inquiries'],
      'website-size': 'two-five',
      'website-capabilities': ['appointment-booking', 'multilingual'],
      'website-booking-type': 'appointments',
      'website-booking-platform': 'calendly',
      'website-content-readiness': 'copywriting',
      'website-brand-readiness': 'guidelines',
    };
    const match = calculateRecommendation(websitesBranch.recommendations, answers);
    const visible = getVisibleQuestions(websitesBranch.questions, answers);
    const estimate = calculateEstimate(match.recommendation, visible, answers);
    const result = buildProjectSummary(websitesBranch, answers, match, estimate);

    expect(estimate.timelineWeeks).toEqual([7, 13]);
    expect(estimate.investmentRange).toEqual([5100, 10800]);
    expect(result).toMatchObject({
      branchId: 'websites',
      recommendationId: 'business-growth-website',
      complexity: 'growth',
      projectType: 'business-website',
      selectedAddOns: ['copywriting'],
      followUpRequired: false,
    });
    expect(result.summary).toContain('Business Growth Website');
    expect(result.summary).toContain('Schedule an appointment');
  });
});
