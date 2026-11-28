import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InquiryStepperForm from './InquiryStepperForm';
import { submitInquiry } from './inquiryFormSubmission';

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));
jest.mock('./inquiryFormSubmission', () => ({ submitInquiry: jest.fn() }));

test('collects a complete inquiry through the six-step form', async () => {
  submitInquiry.mockResolvedValue({ ok: true });
  const onSubmitted = jest.fn();
  render(<InquiryStepperForm onSubmitted={onSubmitted} />);
  const next = () => fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByRole('status', { name: 'Step 1 of 6' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Inquiry QA' } });
  fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'inquiry@example.test' } });
  next();

  expect(screen.getByRole('status', { name: 'Step 2 of 6' })).toBeInTheDocument();
  const projectType = await screen.findByRole('button', { name: /Marketing website/ });
  expect(screen.getByRole('button', { name: /continue/i })).toHaveAttribute('aria-disabled', 'true');
  fireEvent.click(projectType);
  next();

  expect(screen.getByRole('status', { name: 'Step 3 of 6' })).toBeInTheDocument();
  fireEvent.click(await screen.findByRole('button', { name: '$2k–$5k' }));
  next();

  expect(screen.getByRole('status', { name: 'Step 4 of 6' })).toBeInTheDocument();
  fireEvent.click(await screen.findByRole('button', { name: 'Flexible' }));
  next();

  expect(screen.getByRole('status', { name: 'Step 5 of 6' })).toBeInTheDocument();
  fireEvent.change(await screen.findByLabelText(/project details/i), { target: { value: 'A new services website.' } });
  next();

  expect(screen.getByRole('status', { name: 'Step 6 of 6' })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'Upload anything helpful.' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /start the conversation/i }));
  expect(await screen.findByRole('heading', { name: /your inquiry has been received/i })).toBeInTheDocument();
  expect(submitInquiry).toHaveBeenCalledWith(expect.objectContaining({
    name: 'Inquiry QA',
    email: 'inquiry@example.test',
    projectTypes: ['marketing'],
    budget: '$2k–$5k',
    timeline: 'Flexible',
    details: 'A new services website.',
  }), [], '');
  expect(onSubmitted).toHaveBeenCalledTimes(1);
});
