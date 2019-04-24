import React, { useReducer, memo } from "react";
import { Form, Button, Input, Icon, Message, Card } from "semantic-ui-react";
import { Formik, FormikProps, Field } from "formik";
import { NavigateFn } from "@reach/router";
import lodashIsEmpty from "lodash/isEmpty";

import "./styles.scss";
import {
  Props,
  signupUiTexts,
  initialFormValues,
  FormValues,
  formUiTexts,
  validationSchema,
  reducer,
  objectifyApolloError,
  FormFieldProps
} from "./signup";
import { noOp } from "../../constants";
import { APP_ROOT } from "../../routing";
import { RegisterUserFragment } from "../../apollo-generated";

const RenderInput = memo(RenderInputFn, RenderInputFnComp);

export function Signup(props: Props) {
  const [state, dispatch] = useReducer(reducer, {});

  function onSubmit(formProps: FormikProps<FormValues>) {
    return async function() {
      dispatch({
        formErrors: null,
        serverErrors: null
      });

      const { values, validateForm } = formProps;
      const input = { ...values };
      delete input.repeatPassword;

      const { registerUser, navigate, updateLocalUser } = props;

      const formErrors = await validateForm(values);

      if (!lodashIsEmpty(formErrors)) {
        dispatch({ formErrors });

        return;
      }

      try {
        const result = await registerUser({
          variables: {
            input
          }
        });

        const user = (result &&
          result.data &&
          result.data.createUser) as RegisterUserFragment;

        await updateLocalUser({
          variables: { user }
        });

        (navigate as NavigateFn)(APP_ROOT);
      } catch (apolloErrors) {
        dispatch({ serverErrors: objectifyApolloError(apolloErrors) });
      }
    };
  }

  function renderForm(formProps: FormikProps<FormValues>) {
    const formErrors = state.formErrors || {};
    const { graphQLError = {}, networkError = "" } = state.serverErrors || {};

    return (
      <Card>
        <Card.Content>
          <Card.Header>Sign up for free</Card.Header>
        </Card.Content>

        <Card.Content>
          <Form onSubmit={onSubmit(formProps)}>
            <Field
              name="firstName"
              type="text"
              component={RenderInput}
              label={formUiTexts.firstName}
              iconName="user"
            />

            <Field
              name="lastName"
              type="text"
              component={RenderInput}
              label={formUiTexts.lastName}
              iconName="user outline"
            />

            <Field
              name="email"
              type="email"
              component={RenderInput}
              label={formUiTexts.email}
              iconName="mail"
              errors={formErrors.email || graphQLError.email}
            />

            <Field
              name="username"
              type="text"
              component={RenderInput}
              label={formUiTexts.username}
              iconName="user"
              errors={formErrors.username || graphQLError.username}
            />

            <Field
              name="password"
              type="password"
              component={RenderInput}
              label={formUiTexts.password}
              iconName="lock"
              errors={formErrors.password || graphQLError.password}
            />

            <Field
              name="repeatPassword"
              type="password"
              component={RenderInput}
              label={formUiTexts.repeatPassword}
              iconName="lock"
              errors={formErrors.repeatPassword}
            />

            {networkError && (
              <Message negative={true} icon={true}>
                <Icon name="warning circle" />
                <Message.Header>{networkError}</Message.Header>
              </Message>
            )}

            <Button type="submit" primary={true} fluid={true}>
              {signupUiTexts.form.submitBtnText}
            </Button>
          </Form>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="components-signup">
      <Formik
        render={renderForm}
        onSubmit={noOp}
        initialValues={initialFormValues}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={validationSchema}
      />
    </div>
  );
}

function RenderInputFn({
  label,
  type,
  field: { name, ...fieldProps },
  iconName,
  errors
}: FormFieldProps) {
  const hasError = !!errors;

  return (
    <Form.Field error={hasError}>
      <label htmlFor={name}>{label}</label>

      <Input
        id={name}
        name={name}
        fluid={true}
        autoComplete="off"
        {...fieldProps}
        type={type}
        icon={iconName}
        iconPosition="left"
        error={hasError}
      />

      {hasError && (
        <div
          className="input"
          style={{
            marginTop: "8px"
          }}
        >
          <Icon name="warning circle" />
          {errors}
        </div>
      )}
    </Form.Field>
  );
}

function RenderInputFnComp(
  { errors: errors1, field: { value: value1 } }: FormFieldProps,

  { errors: errors2, field: { value: value2 } }: FormFieldProps
) {
  return value1 === value2 && errors1 === errors2;
}
