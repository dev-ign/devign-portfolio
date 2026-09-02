import React, { useRef, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ServicePlannerModal from './ServicePlannerModal';

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

const Harness = () => {
  const [open, setOpen] = useState(false);
  const resultRef = useRef();
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open websites planner</button>
      <ServicePlannerModal
        open={open}
        branchId={open ? 'websites' : null}
        onClose={() => setOpen(false)}
        onComplete={result => { resultRef.current = result; }}
      />
    </>
  );
};

describe('ServicePlannerModal', () => {
  test('renders configuration-driven questions and restores focus when closed', async () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: /open websites planner/i });
    opener.focus();
    fireEvent.click(opener);

    expect(screen.getByRole('dialog', { name: 'Websites' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what kind of website are you planning/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(screen.getByRole('radio', { name: /business website/i }));
    expect(screen.getByText('Business Growth Website')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('heading', { name: /where are you starting from/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close project planner/i }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Websites' })).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });
});
