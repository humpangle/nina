import React, { useReducer } from "react";
import { Form, Button, Card, Message, Input, Icon } from "semantic-ui-react";

import "./styles.scss";
import {
  resetPasswordRequestBtnText,
  reducer,
  resetPasswordRequestSuccess,
  instruction,
  Props,
  emailValidator,
  unknownServerErrorText,
  parseGraphqlErrors,
  toLoginIconTestId
} from "./request-password-reset";
import { NavigateFn } from "@reach/router";
import { LOGIN_PATH } from "../../routing";

export function RequestPasswordReset(props: Props) {
  const [state, dispatch] = useReducer(reducer, { email: "" });
  const {
    formError,
    serverError,
    gqlError,
    networkError,
    resetRequestSuccess
  } = state;

  async function onSubmitFn() {
    dispatch({
      resetRequestSuccess: false,
      formError: "",
      serverError: "",
      gqlError: "",
      networkError: ""
    });

    const email = state.email.trim();

    try {
      emailValidator.validateSync(email);
    } catch ({ errors }) {
      dispatch({ formError: errors[0] });

      return;
    }

    const { requestPasswordReset } = props;

    try {
      const result = await requestPasswordReset({
        variables: { email }
      });

      const token = result && result.data && result.data.requestPasswordReset;

      if (!token) {
        dispatch({ serverError: unknownServerErrorText });

        return;
      }

      await dispatch({ resetRequestSuccess: true });
    } catch (errors) {
      dispatch(parseGraphqlErrors(errors));
    }
  }

  return (
    <div className="components-request-password-reset">
      {resetRequestSuccess ? (
        <Card className="success-card">
          <Icon
            name="close"
            className="to-login-icon"
            data-testid={toLoginIconTestId}
            onClick={() => {
              (props.navigate as NavigateFn)(LOGIN_PATH);
            }}
          />

          <Card.Content className="success-card__content">
            {resetPasswordRequestSuccess}
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content extra={true}> Request password reset </Card.Content>

          <Card.Content>
            <div className="initial-instruction">{instruction}</div>

            <Form onSubmit={onSubmitFn}>
              <Form.Field error={!!(formError || gqlError)}>
                <label htmlFor="email">Email</label>

                <Input
                  id="email"
                  name="email"
                  icon="lock"
                  iconPosition="left"
                  type="email"
                  autoComplete="off"
                  onChange={(e, { value }) => dispatch({ email: value })}
                  error={!!(formError || gqlError)}
                />

                {(formError || gqlError) && (
                  <div
                    className="input"
                    style={{
                      marginTop: "8px"
                    }}
                  >
                    <Icon name="warning circle" />
                    {formError || gqlError}
                  </div>
                )}
              </Form.Field>

              {(serverError || networkError) && (
                <Message negative={true} icon={true}>
                  <Icon name="warning circle" />

                  <Message.Header>
                    {" "}
                    {serverError || networkError}
                  </Message.Header>
                </Message>
              )}
              <Button type="submit" primary={true} fluid={true}>
                {resetPasswordRequestBtnText}
              </Button>
            </Form>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
