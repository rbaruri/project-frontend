import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:8080/v1/graphql", // Replace with your Hasura GraphQL endpoint
    headers: {
      "x-hasura-admin-secret": "myadminsecretkey", // Use environment variables in production
    },
  }),
  cache: new InMemoryCache(),
});

export { client };
