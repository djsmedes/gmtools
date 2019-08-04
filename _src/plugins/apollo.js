import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { get as getCookie } from "js-cookie";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: window.location.protocol + "//" + window.location.host + "/graphql/",
  headers: {
    "X-CSRFToken": getCookie("csrftoken"),
  },
});

// Cache implementation
const cache = new InMemoryCache({
  dataIdFromObject: object => object.uuid || null,
  addTypename: false,
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
