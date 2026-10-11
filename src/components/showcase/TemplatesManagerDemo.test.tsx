import React from 'react';
import { act, render, screen } from '@testing-library/react';
import TemplatesManagerDemo from './TemplatesManagerDemo';
import { getAssignedFirstDraftRule, templateManagerDemo } from '@/data/templateManagerDemo';

let mockReducedMotion = false;
jest.mock('@/hooks/useMediaQuery', () => ({ usePrefersReducedMotion: () => mockReducedMotion }));

beforeEach(() => {
  jest.useFakeTimers();
  mockReducedMotion = false;
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
});

test('shows a settled sharing state when motion is reduced', () => {
  mockReducedMotion = true;
  render(<TemplatesManagerDemo variant="portfolio" isActive isTransitionComplete />);
  expect(screen.getByLabelText('Templates Manager workflow reconstruction')).toHaveAttribute('data-demo-step', '3');
  expect(screen.getByText('Shared with 2 fundraisers', { selector: '.tmx-savebar span' })).toBeInTheDocument();
});

test('the illustrative First Draft rule belongs to one stable template record', () => {
  expect(getAssignedFirstDraftRule(templateManagerDemo.records.original.id)?.label).toBe('Top Donor');
  expect(getAssignedFirstDraftRule(templateManagerDemo.records.personalCopy.id)).toBeNull();
});

afterEach(() => jest.useRealTimers());

test('autoplays only while active, settles after sharing, and replays from a clean state', () => {
  const { rerender } = render(<TemplatesManagerDemo variant="portfolio" isActive={false} isTransitionComplete />);
  const demo = screen.getByLabelText('Templates Manager workflow reconstruction');
  expect(demo).toHaveAttribute('data-demo-step', '0');
  act(() => jest.advanceTimersByTime(10000));
  expect(demo).toHaveAttribute('data-demo-step', '0');

  rerender(<TemplatesManagerDemo variant="portfolio" isActive isTransitionComplete />);
  act(() => jest.advanceTimersByTime(1000));
  act(() => jest.advanceTimersByTime(1000));
  act(() => jest.advanceTimersByTime(1400));
  expect(demo).toHaveAttribute('data-demo-step', '3');
  expect(screen.getByText('Shared with 2 fundraisers', { selector: '.tmx-savebar span' })).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(10000));
  expect(demo).toHaveAttribute('data-demo-step', '3');

  rerender(<TemplatesManagerDemo variant="portfolio" isActive={false} isTransitionComplete />);
  expect(demo).toHaveAttribute('data-demo-step', '0');
  rerender(<TemplatesManagerDemo variant="portfolio" isActive isTransitionComplete />);
  act(() => jest.advanceTimersByTime(1000));
  expect(demo).toHaveAttribute('data-demo-step', '1');
});
