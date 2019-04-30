import { fireEvent } from "react-testing-library";
import React, { ComponentType } from "react";
import { RouteComponentProps, WindowLocation } from "@reach/router";

export function fillField(element: Element, value: string) {
  fireEvent.change(element, {
    target: { value }
  });
}

export function renderWithRouter<TProps extends RouteComponentProps>(
  Ui: ComponentType<TProps>,
  routerProps: Partial<RouteComponentProps> = {}
) {
  const { navigate = jest.fn(), path = "/", ...rest } = routerProps;
  const location = { pathname: path } as WindowLocation;

  return {
    mockNavigate: navigate,
    ...rest,
    location,
    Ui: (props: TProps) => {
      return (
        <Ui navigate={navigate} location={location} {...rest} {...props} />
      );
    }
  };
}
