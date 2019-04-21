import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient, Resolvers } from "apollo-client";
import { ApolloLink, Operation } from "apollo-link";
import { CachePersistor } from "apollo-cache-persist";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";

import { getToken } from "./local-state/storage";
import { initState, LocalState } from "./local-state/resolvers";
import { SCHEMA_VERSION, SCHEMA_VERSION_KEY, SCHEMA_KEY } from "./constants";
import { logGraphql } from "./logger";

let cache: InMemoryCache;
let client: ApolloClient<{}>;
let persistor: CachePersistor<NormalizedCacheObject>;

interface BuildClientCache {
  uri: string;

  headers?: { [k: string]: string };

  /**
   * are we server side rendering?
   */
  isNodeJs?: boolean;
}

// tslint:disable-next-line: no-var-requires
const fetch = require("isomorphic-fetch");

export function buildClientCache(
  { uri, headers, isNodeJs }: BuildClientCache = {} as BuildClientCache
) {
  if (!cache) {
    cache = new InMemoryCache({
      addTypename: true
    });
  }

  if (!client || headers) {
    let link: ApolloLink = new HttpLink({
      uri,
      fetch
    });

    link = middlewareAuthLink(headers).concat(link);
    link = middlewareErrorLink().concat(link);
    link = middlewareLoggerLink(link);

    let resolvers = {} as Resolvers;
    let defaultState = {} as LocalState;

    if (!isNodeJs) {
      const state = initState();
      resolvers = state.resolvers;
      defaultState = state.defaultState;
    }

    client = new ApolloClient({
      cache,
      link,
      resolvers
    });

    if (!isNodeJs) {
      cache.writeData({
        data: defaultState
      });
    }
  }

  return { client, cache };
}

export type PersistCacheFn = (
  appCache: InMemoryCache
) => Promise<CachePersistor<NormalizedCacheObject>>;

export async function persistCache(appCache: InMemoryCache) {
  if (!persistor) {
    persistor = new CachePersistor({
      cache: appCache,
      // tslint:disable-next-line: no-any
      storage: localStorage as any,
      key: SCHEMA_KEY
    });

    const currentVersion = localStorage.getItem(SCHEMA_VERSION_KEY);

    if (currentVersion === SCHEMA_VERSION) {
      // If the current version matches the latest version,
      // we're good to go and can restore the cache.
      await persistor.restore();
    } else {
      // Otherwise, we'll want to purge the outdated persisted cache
      // and mark ourselves as having updated to the latest version.
      await persistor.purge();
      localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
    }
  }

  return persistor;
}

export const resetClientAndPersistor = async (
  appClient: ApolloClient<{}>,
  appPersistor: CachePersistor<NormalizedCacheObject>
) => {
  await appPersistor.pause(); // Pause automatic persistence.
  await appPersistor.purge(); // Delete everything in the storage provider.
  await appClient.clearStore();
  await appPersistor.resume();
};

function middlewareAuthLink(headers: { [k: string]: string } = {}) {
  return new ApolloLink((operation, forward) => {
    const token = getToken() || headers.jwt;

    if (token) {
      headers.authorization = `Bearer ${token}`;
    }

    operation.setContext({
      headers
    });

    return forward ? forward(operation) : null;
  });
}

// const getNow = () => {
//   const n = new Date();
//   return `${n.getHours()}:${n.getMinutes()}:${n.getSeconds()}`;
// };

function middlewareLoggerLink(link: ApolloLink) {
  if (process.env.NODE_ENV === "production") {
    return link;
  }

  const processOperation = (operation: Operation) => ({
    query: operation.query.loc ? operation.query.loc.source.body : "",
    variables: operation.variables
  });

  const logger = new ApolloLink((operation, forward) => {
    const operationName = `Apollo operation: ${operation.operationName}`;

    logGraphql(operationName, processOperation(operation));

    if (!forward) {
      return null;
    }

    const fop = forward(operation);

    if (fop.map) {
      return fop.map(response => {
        logGraphql(operationName, response, true);
        return response;
      });
    }

    return fop;
  });

  return logger.concat(link);
}

function middlewareErrorLink() {
  return onError(({ graphQLErrors, networkError, response, operation }) => {
    const { operationName } = operation;

    if (graphQLErrors) {
      logGraphql(operationName, graphQLErrors, "graphQLErrors");
    }

    if (response) {
      logGraphql(operationName, response);
    }

    if (networkError) {
      logGraphql(operationName, networkError, "networkError");
    }
  });
}
