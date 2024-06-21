import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Configs from './Configs';

vi.mock('react-query');

describe('Configs', () => {
  describe('server host', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('loads and saves configs from local storage', async () => {
      window.localStorage.setItem('serverHost', 'homeserver');
      render(<Configs />);

      const serverHostConfig = screen.getByRole('radiogroup', {
        name: 'Server host',
      });
      const serverHostOptions = within(serverHostConfig).getAllByRole('radio');
      expect(serverHostOptions[0]).not.toBeChecked();
      expect(serverHostOptions[1]).toBeChecked();
      expect(serverHostOptions[2]).not.toBeChecked();

      await userEvent.click(serverHostOptions[0]);
      expect(window.localStorage.getItem('serverHost')).toBe('localhost');
    });

    it('sets server host to localhost when config is not available on local storage', () => {
      render(<Configs />);

      const serverHostConfig = screen.getByRole('radiogroup', {
        name: 'Server host',
      });
      const serverHostOptions = within(serverHostConfig).getAllByRole('radio');
      expect(serverHostOptions[0]).toBeChecked();
      expect(serverHostOptions[1]).not.toBeChecked();
      expect(serverHostOptions[2]).not.toBeChecked();
    });

    it('saves and loads custom server host', async () => {
      window.localStorage.setItem('serverHost', 'custom');
      const customServerHost = 'http://192.168.1.200:4000';
      window.localStorage.setItem('customServerHost', customServerHost);
      render(<Configs />);

      const serverHostConfig = screen.getByRole('radiogroup', {
        name: 'Server host',
      });
      const serverHostOptions = within(serverHostConfig).getAllByRole('radio');
      expect(serverHostOptions[0]).not.toBeChecked();
      expect(serverHostOptions[1]).not.toBeChecked();
      expect(serverHostOptions[2]).toBeChecked();

      const customServerHostInput = screen.getByRole('textbox', {
        name: 'Custom address',
      });
      expect(customServerHostInput).toBeEnabled();
      expect(customServerHostInput).toHaveValue(customServerHost);

      await userEvent.type(customServerHostInput, '{backspace}1');
      await userEvent.click(screen.getByRole('button', { name: 'Ok' }));
      expect(window.localStorage.getItem('customServerHost')).toBe(
        'http://192.168.1.200:4001'
      );
    });
  });
});
