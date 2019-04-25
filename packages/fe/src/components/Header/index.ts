import { compose } from "react-apollo";

import { Header as Comp } from "./header-x";
import { withLocationHOC } from "../utils";
import { fetchLogoHOC } from "./fetch-logo";

export const Header = compose(
  withLocationHOC,
  fetchLogoHOC
)(Comp);
