import { render, screen, getRoles } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { expectInDocByTestId } from 'utils/test';
import { Provider } from 'react-redux';
import { createAppStore } from 'app/redux';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import AppTheme from 'utils/styleValues';
import { LogInPage } from '../LoginPage';

describe('<LoginPage/>', () => {
  describe('Rendering', () => {
    beforeEach(() => {
      const history = createMemoryHistory();
      render(
        <Router history={history}>
          <Provider store={createAppStore()}>
            <ThemeProvider theme={AppTheme}>
              <LogInPage />
            </ThemeProvider>
          </Provider>
        </Router>,
      );
    });

    it('Should render the <LoginForm/>', () => expectInDocByTestId('loginForm'));

    it('Should render a forgot password link', () => {
      const forgotPasswordLink = screen.getByText(/forgot password/i);
      expect(forgotPasswordLink).not.toBeNull();
      expect(getRoles(forgotPasswordLink)).toHaveProperty('link');
    });

    it('Should render a create account link', () => {
      const createAccountLink = screen.getByText(/register/i);
      expect(createAccountLink).not.toBeNull();
      expect(getRoles(createAccountLink)).toHaveProperty('link');
    });
  });

  describe('navigation', () => {
    let history: MemoryHistory;

    beforeEach(() => {
      history = createMemoryHistory();

      render(
        <Router history={history}>
          <Provider store={createAppStore()}>
            <ThemeProvider theme={AppTheme}>
              <LogInPage />
            </ThemeProvider>
          </Provider>
        </Router>,
      );
    });

    it('Should navigate to /auth/forgot-password when the forgot password button is clicked', () => {
      const link = screen.getByText(/forgot password/i);
      userEvent.click(link);
      expect(history.location.pathname).toBe('/auth/forgot-password');
    });

    it('Should navigate to "/auth/signup" when the "Register" link is clicked', () => {
      const createAccountButton = screen.getByText(/register/i);
      userEvent.click(createAccountButton);
      expect(history.location.pathname).toBe('/auth/signup');
    });
  });
});
