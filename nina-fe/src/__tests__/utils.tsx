import { fireEvent } from "react-testing-library";

export function fillField(element: Element, value: string) {
  fireEvent.change(element, {
    target: { value }
  });
}
