import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/AppRoutes';
import { AuthProvider } from '@/context/AuthContext';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );
};

export default App;
