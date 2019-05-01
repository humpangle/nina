import React from "react";
import { Button } from "semantic-ui-react";
import { Link } from "gatsby";

import { LOGIN_PATH, SIGNUP_PATH } from "../../routing";

export const linkTexts = {
  login: "Already have an account? Login",
  signup: "Don't have an account? Sign up in seconds"
};

export function SwitchAuthComponent({ pathname }: { pathname: string }) {
  return (
    <Button
      basic={true}
      fluid={true}
      as={Link}
      to={pathname === LOGIN_PATH ? SIGNUP_PATH : LOGIN_PATH}
    >
      {pathname === LOGIN_PATH ? linkTexts.signup : linkTexts.login}
    </Button>
  );
}
