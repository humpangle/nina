import React from "react";
import { Helmet } from "react-helmet-async";
import { RouteComponentProps } from "@reach/router";

import { Header } from "../../components/Header";
import { makeSiteTitle, LOGIN_TITLE } from "../../constants";
import { Login } from "../../components/Login";

export default function App(props: RouteComponentProps) {
  return (
    <>
      <Helmet>
        <title>{makeSiteTitle(LOGIN_TITLE)}</title>
      </Helmet>

      <div className="pages-signup">
        <Header />

        <div className="main">
          <Login {...props} />
        </div>
      </div>
    </>
  );
}
