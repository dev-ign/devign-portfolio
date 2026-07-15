import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InquiryModal from './InquiryModal';

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

test('only closes from the X close button', () => {
  const onClose = jest.fn();
  render(<InquiryModal open onClose={onClose} />);

  expect(screen.getByRole('dialog', { name: /project inquiry/i })).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).not.toHaveBeenCalled();

  const backdrop = screen.getByTestId('inquiry-modal-backdrop');
  expect(backdrop).toBeInTheDocument();
  fireEvent.click(backdrop);
  expect(onClose).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: /close inquiry form/i }));
  expect(onClose).toHaveBeenCalledTimes(1);
});
