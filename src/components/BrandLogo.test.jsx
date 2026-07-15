import React from 'react';
import { render, screen } from '@testing-library/react';
import BrandLogo from './BrandLogo';

test('uses the mono SVG mark asset', () => {
  render(<BrandLogo />);

  expect(screen.getByRole('presentation')).toHaveAttribute(
    'src',
    '/devignuxlogo-mono.svg'
  );
});
