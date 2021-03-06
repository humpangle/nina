import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent } from "react-testing-library";

import { Header } from "../components/Header/header-x";
import {
  headerUiText,
  Props,
  headerMenuToggleTestId
} from "../components/Header/header";
import { LogoImageQuery_file_childImageSharp_fixed } from "../graphql/gatsby-types/LogoImageQuery";
import { renderWithRouter } from "./utils";
import { SIGNUP_PATH, LOGIN_PATH } from "../routing";

jest.mock("react-transition-group", function() {
  const FakeTransition = jest.fn(({ children }) => children);
  const FakeCSSTransition = jest.fn(props =>
    props.in ? <FakeTransition>{props.children}</FakeTransition> : null
  );
  return { CSSTransition: FakeCSSTransition, Transition: FakeTransition };
});

type P = React.ComponentType<Partial<Props>>;
const HeaderP = Header as P;

const logoAttrs = {} as LogoImageQuery_file_childImageSharp_fixed;

it("toggles open and close menu", () => {
  const howSiteWorkRegexp = new RegExp(headerUiText.menuTexts.howItWorks, "i");
  const { Ui } = renderWithRouter(HeaderP);
  /**
   * Given we have our header
   */
  const { queryByText, getByText, getByTestId } = render(
    <Ui logoAttrs={logoAttrs} />
  );

  /**
   * Then we should see that menu toggle has no class showing it is opened
   */
  const $menuToggle = getByTestId(headerMenuToggleTestId);
  expect($menuToggle.classList).not.toContain("header__menu-toggle--is-open");

  /**
   * And there is no text telling user how the site works
   */
  expect(queryByText(howSiteWorkRegexp)).not.toBeInTheDocument();

  /**
   * When we click on the toggle link
   */
  fireEvent.click($menuToggle);

  /**
   * Then the class of the menu toggle link should now indicate that it is
   * open
   */
  expect($menuToggle.classList).toContain("header__menu-toggle--is-open");

  /**
   * And there should now be a text telling user how the site works
   */
  expect(getByText(howSiteWorkRegexp)).toBeInTheDocument();
});

it("does not show link tag on logo when we are on home page", () => {
  /**
   *  Given that we are on the home page
   */
  const { Ui: Ui1 } = renderWithRouter(HeaderP);

  /**
   * And that we have the site header
   */
  const { getByTestId, rerender } = render(<Ui1 logoAttrs={logoAttrs} />);

  /**
   * Then we should see that the logo is not an anchor tag
   */
  expect(getByTestId("header-logo").nodeName).not.toBe("A");

  /**
   * When we navigate to another page
   */
  const { Ui: Ui2 } = renderWithRouter(HeaderP, { path: SIGNUP_PATH });
  rerender(<Ui2 logoAttrs={logoAttrs} />);

  /**
   * Then the logo should now be an anchor tag
   */
  expect(getByTestId("header-logo").nodeName).toBe("A");
});

it("does not show signup link when we are on sign up page", () => {
  const text = headerUiText.menuTexts.signUp;

  /**
   * Given that we are at the app header on signup page
   */
  const { Ui } = renderWithRouter(HeaderP, { path: SIGNUP_PATH });
  const { getByTestId, queryByText } = render(<Ui logoAttrs={logoAttrs} />);

  /**
   * When we click on menu toggle button
   */
  fireEvent.click(getByTestId(headerMenuToggleTestId));

  /**
   * Then we should not see the signup link
   */
  expect(queryByText(text)).not.toBeInTheDocument();
});

it("does not show login link when we are on login page", () => {
  const text = headerUiText.menuTexts.logIn;

  /**
   * Given that we are at the app header on login page
   */
  const { Ui } = renderWithRouter(HeaderP, { path: LOGIN_PATH });
  const { getByTestId, queryByText } = render(<Ui logoAttrs={logoAttrs} />);

  /**
   * When we click on menu toggle button
   */
  fireEvent.click(getByTestId(headerMenuToggleTestId));

  /**
   * Then we should not see the login link
   */
  expect(queryByText(text)).not.toBeInTheDocument();
});
