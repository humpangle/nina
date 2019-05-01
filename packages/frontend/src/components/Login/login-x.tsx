import React, { Reducer, useReducer, Dispatch } from "react";
import { Formik, FormikProps, Field, FieldProps } from "formik";
import { Form, Input, Button, Card, Message, Icon } from "semantic-ui-react";
import { NavigateFn, WindowLocation } from "@reach/router";
import { Link } from "gatsby";

import "./styles.scss";
import {
  loginFormInitialValues,
  FormValues,
  loginFormLabels,
  loginSubmitButtonText,
  Props,
  emailValidator,
  State,
  parseApolloError,
  loginErrorTestId,
  loginHeader,
  makeFormFieldTestId,
  forgotPasswordLinkText
} from "./login";
import { noOp } from "../../constants";
import { APP_WELCOME_PATH, REQUEST_PASSWORD_RESET_PATH } from "../../routing";
import { LoginInput, RegisterUserFragment } from "../../apollo-generated";
import { SwitchAuthComponent } from "../SwitchAuthComponent";

const reducer: Reducer<State, State> = function reducerFn(prevState, newState) {
  return { ...prevState, ...newState };
};

export function Login(props: Props) {
  const [state, dispatch] = useReducer(reducer, {});

  function onSubmit(formProps: FormikProps<FormValues>) {
    return async function() {
      dispatch({
        graphqlError: "",
        shouldClearPassword: false,
        networkError: ""
      });

      const {
        values: { usernameEmail, password }
      } = formProps;

      const { navigate, login, updateLocalUser } = props;

      let key: keyof LoginInput;

      try {
        emailValidator.validateSync(usernameEmail);
        key = "email";
      } catch (error) {
        key = "username";
      }

      try {
        const result = await login({
          variables: {
            input: {
              password,
              [key]: usernameEmail
            }
          }
        });

        const user = (result &&
          result.data &&
          result.data.login) as RegisterUserFragment;

        await updateLocalUser({ variables: { user } });

        (navigate as NavigateFn)(APP_WELCOME_PATH);
      } catch (errors) {
        const { networkError, graphqlError } = parseApolloError(errors);
        dispatch({
          networkError,
          graphqlError,
          shouldClearPassword: !!graphqlError
        });
      }
    };
  }

  function renderForm(formProps: FormikProps<FormValues>) {
    const { graphqlError, networkError, shouldClearPassword } = state;

    return (
      <Card>
        <Card.Content>
          <Card.Header>{loginHeader}</Card.Header>
        </Card.Content>

        <Card.Content>
          <Form onSubmit={onSubmit(formProps)}>
            <Field
              name="usernameEmail"
              component={FormInput}
              autoComplete="off"
              iconName="user"
            />

            <Field
              name="password"
              component={FormInput}
              autoComplete="off"
              iconName="lock"
              type="password"
              shouldClearPassword={shouldClearPassword}
              dispatch={dispatch}
            />

            {(graphqlError || networkError) && (
              <Message
                data-testid={loginErrorTestId}
                negative={true}
                icon={true}
              >
                <Icon name="warning circle" />
                <Message.Header>{graphqlError || networkError}</Message.Header>
              </Message>
            )}

            <Button type="submit" fluid={true} primary={true}>
              {loginSubmitButtonText}
            </Button>
          </Form>
        </Card.Content>

        <Card.Content
          extra={true}
          style={{
            marginTop: "35px"
          }}
        >
          <SwitchAuthComponent
            pathname={(props.location as WindowLocation).pathname}
          />
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="components-login">
      <Formik
        onSubmit={noOp}
        validateOnBlur={false}
        validateOnChange={false}
        render={renderForm}
        initialValues={loginFormInitialValues}
      />
    </div>
  );
}

interface FormInputProps extends FieldProps<FormValues> {
  shouldClearPassword: boolean;
  dispatch: Dispatch<State>;
  iconName: string;
  type?: string;
}

function FormInput(props: FormInputProps) {
  const {
    type = "text",
    shouldClearPassword,
    iconName,
    dispatch,
    field: { name: name0, value, ...restField },
    form: { setFieldValue }
  } = props;

  const name = name0 as keyof FormValues;
  let inputValue = value;
  let onFocus = noOp;

  if (name === "password" && shouldClearPassword) {
    inputValue = "";
    onFocus = function onFocusFn() {
      setFieldValue("password", "");
      dispatch({ shouldClearPassword: false });
      return null;
    };
  }

  return (
    <Form.Field data-testid={makeFormFieldTestId(name)}>
      <div className="label">
        <label htmlFor={name}>{loginFormLabels[name]}</label>

        {name === "password" && (
          <Link className="forgot-password" to={REQUEST_PASSWORD_RESET_PATH}>
            {forgotPasswordLinkText}
          </Link>
        )}
      </div>

      <Input
        type={type as string}
        name={name}
        id={name}
        value={inputValue}
        icon={iconName}
        iconPosition="left"
        {...restField}
        onFocus={onFocus}
      />
    </Form.Field>
  );
}
