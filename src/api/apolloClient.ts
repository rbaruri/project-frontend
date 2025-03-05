import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      // If we get an authentication error, redirect to login
      if (message.includes('JWT') || message.includes('x-hasura-admin-secret')) {
        console.error('Authentication error:', message);
      }
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Auth link to add headers
const authLink = new ApolloLink((operation, forward) => {
  const adminSecret = import.meta.env.VITE_HASURA_ADMIN_SECRET;
  
  if (!adminSecret) {
    console.error('VITE_HASURA_ADMIN_SECRET is not set in environment variables');
  }

  // Add the admin secret to headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'x-hasura-admin-secret': adminSecret || '',
      'x-hasura-role': 'admin'
    }
  }));

  return forward(operation);
});

// HTTP connection to the API
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_HASURA_ENDPOINT || "http://localhost:8080/v1/graphql",
  credentials: 'include' // This enables sending cookies with requests
});

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        learning_paths: {
          merge(existing, incoming) {
            return incoming; // Always use the new data
          },
        },
      },
    },
  },
});

// Create the Apollo Client instance
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: true
});
