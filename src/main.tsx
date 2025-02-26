import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import store from './redux/store';
import { client } from './api/apolloClient';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

const ApolloProvider = BaseApolloProvider as React.FC<{ children: React.ReactNode; client: typeof client }>;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ApolloProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
