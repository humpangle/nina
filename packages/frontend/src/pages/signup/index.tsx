import React from "react";
import { Helmet } from "react-helmet-async";
import { RouteComponentProps } from "@reach/router";

import "./styles.scss";
import { Header } from "../../components/Header";
import { Signup } from "../../components/Signup";
import { makeSiteTitle, SIGNUP_TITLE } from "../../constants";

export default function App(props: RouteComponentProps) {
  return (
    <>
      <Helmet>
        <title>{makeSiteTitle(SIGNUP_TITLE)}</title>
      </Helmet>

      <div className="pages-signup">
        <Header />

        <div className="main">
          <Signup {...props} />
        </div>
      </div>
    </>
  );
}
