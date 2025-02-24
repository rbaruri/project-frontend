import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Auth link to add headers
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');

  operation.setContext({
    headers: {
      "x-hasura-admin-secret": import.meta.env.VITE_HASURA_ADMIN_SECRET || '',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });

  return forward(operation);
});

// HTTP connection to the API
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_HASURA_ENDPOINT || "http://localhost:8080/v1/graphql",
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
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: true, // Enable Apollo dev tools
});

export { client };
