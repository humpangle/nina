import React from "react";
import { ApolloProvider } from "react-apollo";
import { HelmetProvider } from "react-helmet-async";

import "./src/styles/semantic.less";
import "./src/styles/globals.scss";
import { buildClientCache, persistCache } from "./src/apollo-setup";
import { NinaProvider } from "./src/nina-context";
import { RootHelmet } from "./src/components/root-helmet";

export const wrapRootElement = ({ element }) => {
  const { client, cache } = buildClientCache();

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
