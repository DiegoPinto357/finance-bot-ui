import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import NavigationBar from './NavigationBar';
import { routes } from '../routes';

describe('NavigationBar', () => {
  it('navigates to correct pages on menu item click', async () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );

    await userEvent.click(screen.getByText('Home'));
    expect(window.location.pathname).toBe('/');

    for (const subMenuItem of routes.stock) {
      await userEvent.click(screen.getByRole('button', { name: 'Stock' }));
      await userEvent.click(
        await screen.findByRole('link', { name: subMenuItem.label })
      );
      expect(window.location.pathname).toBe(subMenuItem.path);
    }

    for (const subMenuItem of routes.crypto) {
      await userEvent.click(screen.getByRole('button', { name: 'Crypto' }));
      await userEvent.click(
        await screen.findByRole('link', { name: subMenuItem.label })
      );
      expect(window.location.pathname).toBe(subMenuItem.path);
    }

    for (const subMenuItem of routes.portfolio) {
      await userEvent.click(screen.getByRole('button', { name: 'Portfolio' }));
      await userEvent.click(
        await screen.findByRole('link', { name: subMenuItem.label })
      );
      expect(window.location.pathname).toBe(subMenuItem.path);
    }

    await userEvent.click(screen.getByText('Settings'));
    expect(window.location.pathname).toBe('/settings');
  });
});
