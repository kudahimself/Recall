import React from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo', () => {
  it('shows the generated elephant tile beside the Recall wordmark', () => {
    render(<Logo />);
    expect(screen.getByText('Recall')).toBeInTheDocument();
    // alt="" makes the tile decorative (role presentation): the wordmark names it.
    const tile = screen.getByRole('presentation');
    expect(tile).toHaveAttribute('src', expect.stringMatching(/\/icon\.svg$/));
    expect(tile).toHaveAttribute('alt', '');
  });

  it('keeps the wordmark for screen readers when collapsed', () => {
    render(<Logo collapse />);
    expect(screen.getByText('Recall')).toBeInTheDocument();
  });
});
