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
    // todo - make this reactive or ideally make django just use the damn cookie
    "X-CSRFToken": getCookie("csrftoken"),
  },
});

const simpleCacheRedirect = (_, args, { getCacheKey }) =>
  getCacheKey({ id: args.id });

// Cache implementation
const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      creatureprop: simpleCacheRedirect,
    },
  },
  addTypename: false,
  dataIdFromObject: data => data.id,
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
