import { ThemeProvider } from './theme/ThemeProvider';
import ThemeSwitch from './theme/ThemeSwitch';
import Router from './Router';
import NavigationBar from './NavigationBar';

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <header className="container flex p-4">
        <NavigationBar />
        <ThemeSwitch className="ml-auto" />
      </header>
      <main className="container mx-auto pt-4 pb-8">
        <Router />
      </main>
    </ThemeProvider>
  );
};

export default App;
