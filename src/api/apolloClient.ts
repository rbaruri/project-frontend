import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://your-hasura-instance.herokuapp.com/v1/graphql", // Replace with your Hasura GraphQL endpoint
    headers: {
      "x-hasura-admin-secret": "your-hasura-admin-secret", // Use environment variables in production
    },
  }),
  cache: new InMemoryCache(),
});

export { client };
