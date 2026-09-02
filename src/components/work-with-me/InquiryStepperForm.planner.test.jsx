import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InquiryStepperForm from './InquiryStepperForm';

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

const plannerResult = {
  branchId: 'websites',
  answers: {
    'website-type': 'business-website',
    'investment-comfort': '3000-6000',
    'target-timeline': 'two-three-months',
  },
  recommendationId: 'business-growth-website',
  recommendationTitle: 'Business Growth Website',
  confidence: 'high',
  complexity: 'growth',
  projectType: 'business-website',
  selectedFeatures: [],
  selectedAddOns: [],
  estimatedTimelineWeeks: [4, 7],
  estimatedInvestmentRange: [3500, 6500],
  assumptions: [],
  followUpRequired: false,
  summary: 'Websites — Business Growth Website\n\nA multi-page business website.',
};

test('skips previously answered project questions and carries the summary into the inquiry', async () => {
  render(<InquiryStepperForm plannerResult={plannerResult} />);

  expect(screen.getByRole('status', { name: 'Step 1 of 3' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Planner QA' } });
  fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'planner@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByRole('status', { name: 'Step 2 of 3' })).toBeInTheDocument();
  const details = await screen.findByLabelText(/project details/i);
  expect(details.value).toContain('Business Growth Website');
  expect(screen.queryByText('Choose the kind of work you need.')).not.toBeInTheDocument();
});
