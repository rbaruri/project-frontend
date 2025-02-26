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
      if (message.includes('JWT')) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Auth link to add headers
const authLink = new ApolloLink((operation, forward) => {
  // Always include admin secret
  const headers: Record<string, string> = {
    'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET
  };

  operation.setContext({
    headers,
    credentials: 'include' // This enables sending cookies with requests
  });

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

// Create Apollo Client instance
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
