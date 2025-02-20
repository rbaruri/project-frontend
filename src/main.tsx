import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Make sure this path is correct
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { client } from './api/apolloClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>  {/* 🔹 Wrap in Redux Provider */}
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
