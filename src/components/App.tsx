import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from './theme/ThemeProvider';
import ThemeSwitch from './theme/ThemeSwitch';
import Router from './Router';
import NavigationBar from './NavigationBar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20 * (60 * 1000),
      cacheTime: 20 * (60 * 1000),
    },
  },
});

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <header className="container flex p-4 fixed bg-background top-0">
            <NavigationBar />
            <ThemeSwitch className="ml-auto" />
          </header>
          <main className="container mx-auto mt-[68px] pt-4 pb-8">
            <Router />
          </main>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
