import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; 
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { client } from './api/apolloClient';
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}> 
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
