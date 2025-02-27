import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/AppRoutes';
import { FC } from 'react';

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
