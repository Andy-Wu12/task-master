import { render, screen } from '@testing-library/react';

import Home from '../../routes/Landing';
import { BrowserRouter } from 'react-router-dom';

describe('Homepage', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
  });

  test('should have Task Master in the title', () => {
    const headerElem = screen.getByText('Task Master');
    expect(headerElem).toBeInTheDocument();
  });

  test('should have a button that redirects to authentication page', () => {
    const loginButton = screen.getByText(/Get Started/);
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('href', '/auth');
  });

})