import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InquiryModal from './InquiryModal';

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

test('only closes from the X close button', () => {
  const onClose = jest.fn();
  const { container } = render(<InquiryModal open onClose={onClose} />);

  expect(screen.getByRole('dialog', { name: /project inquiry/i })).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).not.toHaveBeenCalled();

  const backdrop = container.querySelector('[aria-hidden="true"]');
  expect(backdrop).toBeInTheDocument();
  fireEvent.click(backdrop);
  expect(onClose).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: /close inquiry form/i }));
  expect(onClose).toHaveBeenCalledTimes(1);
});
