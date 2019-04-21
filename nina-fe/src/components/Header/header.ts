import { RouteComponentProps } from "@reach/router";

import { LogoImageQuery_file_childImageSharp_fixed } from "../../graphql/gatsby/types/LogoImageQuery";

export interface OwnProps {
  leftMenuItems?: JSX.Element[];
  rightMenuItems?: JSX.Element[];
}

export interface Props extends RouteComponentProps, OwnProps, WithLogo {}

export const headerUiText = {
  menuTexts: {
    logIn: "Log in",
    signUp: "Sign up",
    howItWorks: "How It Works"
  }
};

export interface WithLogo {
  logoAttrs: LogoImageQuery_file_childImageSharp_fixed;
}
