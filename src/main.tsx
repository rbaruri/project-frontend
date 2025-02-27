import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { ApolloProvider } from '@apollo/client';
import { client } from './api/apolloClient';
import App from './App';
import './index.css'; 

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
