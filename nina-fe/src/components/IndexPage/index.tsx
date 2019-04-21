import React from "react";

import { useSetupCachePersistor } from "../../nina-context";
import { Header } from "../Header";

export function IndexPage() {
  useSetupCachePersistor();

  return (
    <div
      style={{
        margin: "0 1em"
      }}
      className="index-page"
    >
      <Header />

      <h2>Organize your purse</h2>
      <h3>Do more with less</h3>
    </div>
  );
}
