import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { ApolloClient, ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { client } from './api/apolloClient';
import App from './App';
import './index.css'; 

const ApolloProvider = BaseApolloProvider as React.FC<{ client: ApolloClient<any>; children: React.ReactNode }>;

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}> 
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
