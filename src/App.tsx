import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/AppRoutes';
import { FC } from 'react';
import { Toaster } from 'react-hot-toast';

const App: FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#22c55e',
          },
        },
        error: {
          style: {
            background: '#ef4444',
          },
        },
      }} />
    </>
  );
};

export default App;
