import Router from './Router';
import NavigationBar from './NavigationBar';

const App = () => {
  return (
    <>
      <header className="container px-0">
        <NavigationBar />
      </header>
      <main className="container mx-auto pt-4 pb-8">
        <Router />
      </main>
    </>
  );
};

export default App;
