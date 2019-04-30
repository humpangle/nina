import React from "react";
import { RouteComponentProps } from "@reach/router";

import "./styles.scss";
import { useSetupCachePersistor } from "../../nina-context";
import { Header } from "../Header";
import { Signup } from "../Signup";

export function IndexPage(props: RouteComponentProps) {
  useSetupCachePersistor();

  return (
    <div className="components-index-page">
      <Header />

      <div className="main">
        <h2>Organize your purse</h2>
        <h3>Do more with less</h3>

        <Signup {...props} />
      </div>
    </div>
  );
}
