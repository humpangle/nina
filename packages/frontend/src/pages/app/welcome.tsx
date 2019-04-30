import React from "react";
import { Helmet } from "react-helmet-async";

import { Header } from "../../components/Header";
import { makeSiteTitle, APP_WELCOME_TITLE } from "../../constants";

export default function App() {
  return (
    <>
      <Helmet>
        <title>{makeSiteTitle(APP_WELCOME_TITLE)}</title>
      </Helmet>

      <div>
        <Header />
        App
      </div>
    </>
  );
}
