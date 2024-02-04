import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from './theme/ThemeProvider';
import ThemeSwitch from './theme/ThemeSwitch';
import Router from './Router';
import NavigationBar from './NavigationBar';

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <header className="container flex p-4">
          <NavigationBar />
          <ThemeSwitch className="ml-auto" />
        </header>
        <main className="container mx-auto pt-4 pb-8">
          <Router />
        </main>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
