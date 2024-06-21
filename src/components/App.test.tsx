import { render } from '@testing-library/react';
import httpClient from '@/lib/httpClient';
import App from './App';

vi.spyOn(httpClient, 'config');

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads configs on startup', () => {
    window.localStorage.setItem('serverHost', 'custom');
    const customServerHost = 'http://192.168.1.200:4000';
    window.localStorage.setItem('customServerHost', customServerHost);
    render(<App />);

    expect(window.localStorage.getItem).toBeCalledTimes(3);
    expect(window.localStorage.getItem).toBeCalledWith('vite-ui-theme');

    expect(window.localStorage.getItem).toBeCalledWith('serverHost');
    expect(window.localStorage.getItem).toBeCalledWith('customServerHost');
    expect(httpClient.config).toBeCalledTimes(1);
    expect(httpClient.config).toBeCalledWith({
      host: customServerHost,
    });
  });
});
