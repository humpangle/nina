import React from "react";
import { Form, Input, Button } from "semantic-ui-react";
import { Formik, FormikProps, FastField, FieldProps } from "formik";
import { NavigateFn } from "@reach/router";

import {
  Props,
  signupUiTexts,
  initialFormValues,
  FormValues,
  formUiTexts
} from "./signup";
import { noOp } from "../../constants";
import { APP_ROOT } from "../../routing";

export function Signup(props: Props) {
  function onSubmit(formProps: FormikProps<FormValues>) {
    const input = { ...formProps.values };
    delete input.repeatPassword;

    const { registerUser, navigate } = props;

    return async function() {
      await registerUser({
        variables: {
          input
        }
      });

      (navigate as NavigateFn)(APP_ROOT);
    };
  }

  function renderForm(formProps: FormikProps<FormValues>) {
    return (
      <Form
        onSubmit={onSubmit(formProps)}
        style={{
          maxHeight: "200px",
          overflowY: "scroll"
        }}
      >
        <FastField
          name="firstName"
          type="text"
          component={RenderInput}
          label={formUiTexts.firstName}
        />

        <FastField
          name="lastName"
          type="text"
          component={RenderInput}
          label={formUiTexts.lastName}
        />

        <FastField
          name="email"
          type="email"
          component={RenderInput}
          label={formUiTexts.email}
        />

        <FastField
          name="username"
          type="text"
          component={RenderInput}
          label={formUiTexts.username}
        />

        <FastField
          name="password"
          type="password"
          component={RenderInput}
          label={formUiTexts.password}
        />

        <FastField
          name="repeatPassword"
          type="password"
          component={RenderInput}
          label={formUiTexts.repeatPassword}
        />

        <Button type="submit" primary={true}>
          {signupUiTexts.form.submitBtnText}
        </Button>
      </Form>
    );
  }

  return (
    <Formik
      render={renderForm}
      onSubmit={noOp}
      initialValues={initialFormValues}
      validateOnBlur={false}
      validateOnChange={false}
    />
  );
}

function RenderInput({
  label,
  type,
  field
}: FieldProps<FormValues> & {
  label: string;
  type: string;
}) {
  const name = field.name;

  return (
    <Form.Field
      {...field}
      type={type}
      control={Input}
      autoComplete="off"
      label={label}
      id={name}
    />
  );
}
