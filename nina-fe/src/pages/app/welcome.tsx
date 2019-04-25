import React from "react";
import { Helmet } from "react-helmet-async";

import { Header } from "../../components/Header";
import { makeSiteTitle } from "../../constants";

export default function App() {
  return (
    <>
      <Helmet>
        <title>{makeSiteTitle("Welcome")}</title>
      </Helmet>

      <div>
        <Header />
        App
      </div>
    </>
  );
}
