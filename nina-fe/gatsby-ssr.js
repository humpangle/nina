import React from "react";
import { ApolloProvider } from "react-apollo";
import { HelmetProvider } from "react-helmet-async";

import { buildClientCache } from "./src/apollo-setup";
import { NinaProvider } from "./src/nina-context";
import { RootHelmet } from "./src/components/root-helmet";

export const wrapRootElement = ({ element }) => {
  const { client } = buildClientCache({
    isNodeJs: true,
    uri: "/"
  });

  return (
    <ApolloProvider client={client}>
      <NinaProvider
        value={{
          client
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
