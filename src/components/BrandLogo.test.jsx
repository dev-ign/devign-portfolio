import React from 'react';
import { render } from '@testing-library/react';
import BrandLogo from './BrandLogo';

test('uses the mono SVG mark asset', () => {
  const { container } = render(<BrandLogo />);

  expect(container.querySelector('img')).toHaveAttribute(
    'src',
    '/devignuxlogo-mono.svg'
  );
});
