import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AuthenticationForm, { SignUpForm, LogInForm } from '../../routes/Auth/Auth';
import { BrowserRouter } from 'react-router-dom';

describe('<SignUpForm />', () => {
  let passwordInput: any;
  let usernameInput: any;
  let submitButton: any;

  const setup = () => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );

    usernameInput = screen.getByLabelText(/username/i);
    passwordInput = screen.getByLabelText(/password/i);
    submitButton = screen.getByRole('button', { name: /submit/i });
  };

  beforeEach(() => {
    setup();
  });

  test('should have Sign Up in the header', () => {
    const headerElem = screen.getByText('Submit');
    expect(headerElem).toBeInTheDocument();
  });

  test('should have a form with username, and password fields', async () => {
    const formElement = await screen.findByRole('form');

    expect(formElement).toContainElement(usernameInput);
    expect(formElement).toContainElement(passwordInput);

  });

  test('should have an input field with type "password"', () => {
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should have a button to submit form', () => {
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(/submit/i);
  });

  ///// jest does not integrate properly with react-bootstrap components
  ///// due to css not being loaded into JSDOM (https://twitter.com/kentcdodds/status/1051830222322991105)
  ///// and there doesn't seem to be a clean alternative using just Jest and RTL
  ///// TODO: Research emotion testing library

  // test('password length < 5 triggers an error message', async () => {
  //   const errorRegex = /invalid password/i;

  //   const user = userEvent.setup();
  //   expect(screen.getByText(errorRegex)).not.toBeVisible();

  //   await user.clear(passwordInput);
  //   await user.type(passwordInput, '1234');
  //   await user.click(submitButton);
  //   expect(screen.getByText(errorRegex)).toBeVisible();
  //   await user.type(passwordInput, '5');
  //   expect(screen.queryByText(errorRegex)).not.toBeVisible();
  // });

  // test('email should display an invalid format validation', async () => {
  //   const errorRegex = /invalid email format/i;

  //   const user = userEvent.setup();
  //   await user.clear(emailInput);
  //   await user.type(emailInput, 'tester@testing');
  //   await user.click(submitButton);
  //   expect(screen.getByText(errorRegex)).toBeInTheDocument();
  //   await user.type(emailInput, '.com');
  //   await user.click(submitButton);
  //   expect(screen.queryByText(errorRegex)).not.toBeInTheDocument();
  // });

  // test('invalid username should trigger an error message', async () => {
  //   const errorRegex = /invalid username/i;

  //   const user = userEvent.setup();
  //   await user.clear(usernameInput);
  //   await user.click(submitButton);
  //   expect(screen.getByText(errorRegex)).toBeInTheDocument();
  //   await user.type(usernameInput, 'A');
  //   await user.click(submitButton);
  //   expect(screen.queryByText(errorRegex)).not.toBeInTheDocument();
  // });
})