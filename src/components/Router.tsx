import { Routes, Route } from 'react-router-dom';
import Typography from './lib/Typography';
import { routes } from './routes';

const Router = () => {
  return (
    <Routes>
      {Object.keys(routes).map(category =>
        routes[category].map(route => (
          <Route
            key={route.path}
            path={route.path}
            Component={route.component}
          />
        ))
      )}

      <Route
        path="*"
        element={<Typography variant="h1">Not found</Typography>}
      />
    </Routes>
  );
};

export default Router;
