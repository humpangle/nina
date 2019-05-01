import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";

import {
  SwitchAuthComponent,
  linkTexts
} from "../components/SwitchAuthComponent";
import { ROOT_PATH, LOGIN_PATH, SIGNUP_PATH } from "../routing";

it("renders login link ", () => {
  const { getByText } = render(<SwitchAuthComponent pathname={ROOT_PATH} />);
  expect((getByText(linkTexts.login) as HTMLAnchorElement).href).toContain(
    LOGIN_PATH
  );
});

it("renders signup link ", () => {
  const { getByText } = render(<SwitchAuthComponent pathname={LOGIN_PATH} />);
  expect((getByText(linkTexts.signup) as HTMLAnchorElement).href).toContain(
    SIGNUP_PATH
  );
});
