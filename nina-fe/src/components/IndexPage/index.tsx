import React from "react";
import { useSetupCachePersistor } from "../../nina-context";

export function IndexPage() {
  useSetupCachePersistor();

  return <div className="index-page">This is the index page</div>;
}
