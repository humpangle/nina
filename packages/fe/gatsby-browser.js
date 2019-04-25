import React from "react";
import { ApolloProvider } from "react-apollo";
import { HelmetProvider } from "react-helmet-async";

import "./src/styles/semantic-theme/semantic.less";
import "./src/styles/globals.scss";
import { buildClientCache, persistCache } from "./src/apollo-setup";
import { NinaProvider } from "./src/nina-context";
import { RootHelmet } from "./src/components/root-helmet";
import { getBackendUrls } from "./src/get-backend-urls";

export const wrapRootElement = ({ element }) => {
  const { client, cache } = buildClientCache({
    uri: getBackendUrls().apiUrl
  });

  return (
    <ApolloProvider client={client}>
      <NinaProvider
        value={{
          client,
          cache,
          persistCache
        }}
      >
        <HelmetProvider>
          <RootHelmet />

          {element}
        </HelmetProvider>
      </NinaProvider>
    </ApolloProvider>
  );
};
