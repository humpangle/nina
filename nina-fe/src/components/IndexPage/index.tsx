import React from "react";

import { useSetupCachePersistor } from "../../nina-context";
import { Header } from "../Header";
import { Signup } from "../Signup";

export function IndexPage() {
  useSetupCachePersistor();

  return (
    <div className="index-page">
      <Header />

      <div className="main" style={{ margin: "0 1em" }}>
        <h2>Organize your purse</h2>
        <h3>Do more with less</h3>

        <Signup />
      </div>
    </div>
  );
}
