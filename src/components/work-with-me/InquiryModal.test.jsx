import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InquiryModal from './InquiryModal';

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

test('closes from Escape and the close button while ignoring backdrop clicks', () => {
  const onClose = jest.fn();
  render(<InquiryModal open onClose={onClose} />);

  expect(screen.getByRole('dialog', { name: /project inquiry/i })).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledTimes(1);

  const backdrop = screen.getByTestId('inquiry-modal-backdrop');
  expect(backdrop).toBeInTheDocument();
  fireEvent.click(backdrop);
  expect(onClose).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole('button', { name: /close inquiry form/i }));
  expect(onClose).toHaveBeenCalledTimes(2);
});
