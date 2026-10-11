import { getCurrentTimelineStage, getTimelineFill, OWNERSHIP_PHASES } from './ownershipTimeline';

test('the line reaches each measured marker when that stage activates', () => {
  const sharedCenter = 0.36;
  const fundraiserCenter = 0.73;
  expect(getTimelineFill(0, sharedCenter, fundraiserCenter)).toBe(0);
  expect(getTimelineFill(OWNERSHIP_PHASES.shared, sharedCenter, fundraiserCenter)).toBeCloseTo(sharedCenter);
  expect(getCurrentTimelineStage(OWNERSHIP_PHASES.shared)).toBe(1);
  expect(getTimelineFill(OWNERSHIP_PHASES.fundraiser, sharedCenter, fundraiserCenter)).toBeCloseTo(fundraiserCenter);
  expect(getCurrentTimelineStage(OWNERSHIP_PHASES.fundraiser)).toBe(2);
  expect(getTimelineFill(1, sharedCenter, fundraiserCenter)).toBe(1);
});

test('the timeline retracts and milestones return to earlier states on reverse scroll', () => {
  const fractions = [1, 0.85, 0.6, 0.44, 0.1, 0].map(value => getTimelineFill(value, 0.4, 0.8));
  expect(fractions).toEqual([...fractions].sort((a, b) => b - a));
  expect([1, 0.6, 0.1].map(getCurrentTimelineStage)).toEqual([2, 1, 0]);
});
