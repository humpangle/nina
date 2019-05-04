import React from "react";
import { Helmet } from "react-helmet-async";
import { RouteComponentProps } from "@reach/router";

import { Header } from "../../components/Header";
import { makeSiteTitle, RESET_PASSWORD_TITLE } from "../../constants";
import { RequestPasswordReset } from "../../components/RequestPasswordReset";

export default function App(props: RouteComponentProps) {
  return (
    <>
      <Helmet>
        <title>{makeSiteTitle(RESET_PASSWORD_TITLE)}</title>
      </Helmet>

      <div className="pages-signup">
        <Header />

        <div className="main">
          <RequestPasswordReset {...props} />
        </div>
      </div>
    </>
  );
}
