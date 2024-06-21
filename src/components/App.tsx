import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from './theme/ThemeProvider';
import ThemeSwitch from './theme/ThemeSwitch';
import Router from './Router';
import NavigationBar from './NavigationBar';
import useConfigs from './useConfigs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20 * (60 * 1000),
      cacheTime: 20 * (60 * 1000),
    },
  },
});

const App = () => {
  useConfigs();
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <header className="fixed w-full bg-background top-0 z-50">
            <div className="container flex p-4">
              <NavigationBar />
              <ThemeSwitch className="ml-auto" />
            </div>
          </header>
          <DndProvider backend={HTML5Backend}>
            <main className="container mx-auto mt-[68px] pt-4 pb-8">
              <Router />
            </main>
          </DndProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
