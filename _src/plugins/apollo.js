import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { get as getCookie } from "js-cookie";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: window.location.protocol + "//" + window.location.host + "/graphql/",
  fetch: (uri, options) => {
    options.headers["X-CSRFToken"] = getCookie("csrftoken");
    return fetch(uri, options);
  },
});

// Cache implementation
const cache = new InMemoryCache({
  addTypename: false,
  dataIdFromObject: data => data.uuid,
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
