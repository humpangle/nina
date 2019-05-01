import React, { useState } from "react";
import { Menu, Button } from "semantic-ui-react";
import parseClassnames from "classnames";
import { Link } from "gatsby";
import { WindowLocation } from "@reach/router";
import { CSSTransition } from "react-transition-group";

import "./styles.scss";
import { headerUiText, Props, headerMenuToggleTestId } from "./header";
import { ROOT_PATH, SIGNUP_PATH, LOGIN_PATH } from "../../routing";

export function Header(props: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { logoAttrs } = props;

  const location = props.location as WindowLocation;
  const { pathname } = location;
  const logoCompAttrs =
    pathname === ROOT_PATH ? { as: "span" } : { as: Link, to: ROOT_PATH };

  function isMenuOpenCb() {
    setIsMenuOpen(arg => !arg);
  }

  return (
    <div className="components-header">
      <Menu secondary={true} className="header-navs">
        <>
          <style>
            {`#components-header-logo{ background: url(${
              logoAttrs.src
            }) no-repeat 0 !important; background-size: ${logoAttrs.width}px ${
              logoAttrs.height
            }px !important;}`}
          </style>

          <Menu.Item
            id="components-header-logo"
            data-testid="header-logo"
            className="header__logo"
            {...logoCompAttrs}
          />
        </>

        <Menu.Menu position="right">
          <Menu.Item
            as="a"
            className={parseClassnames({
              "header__menu-toggle": true,
              "header__menu-toggle--is-open": isMenuOpen
            })}
            data-testid={headerMenuToggleTestId}
            onClick={isMenuOpenCb}
          >
            <div className="td-css-icon-cross">
              <div className="td-css-icon-cross__y" />
            </div>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <CSSTransition
        in={isMenuOpen}
        timeout={500}
        className="header__menu"
        unmountOnExit={true}
      >
        <Menu vertical={true}>
          <Menu.Item className="header__menu-item">
            {headerUiText.menuTexts.howItWorks}
          </Menu.Item>

          {pathname !== LOGIN_PATH && (
            <Menu.Item as={Link} to={LOGIN_PATH} className="header__menu-item">
              {headerUiText.menuTexts.logIn}
            </Menu.Item>
          )}

          {pathname !== SIGNUP_PATH && (
            <Menu.Item className="header__menu-item ">
              <Button
                className="header__menu-item--sign-up-link"
                as={Link}
                to={SIGNUP_PATH}
                basic={true}
              >
                {headerUiText.menuTexts.signUp}
              </Button>
            </Menu.Item>
          )}
        </Menu>
      </CSSTransition>
    </div>
  );
}
