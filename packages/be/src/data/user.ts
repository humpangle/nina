import * as Yup from "yup";

import { Timestamps, timestamps } from "./utils";
import { Credential } from "./credential";
import { CreateUserInput } from "../apollo.generated";

export interface User extends Timestamps {
  id: string | number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  credential?: Credential;
  jwt?: string | null;
}

export enum userDataLen {
  usernameMin = 3,
  usernameMax = 15,
  passwordMin = 5,
  passwordMax = 20
}

export const userEntityColumnMapping: { [k in keyof User]: string } = {
  id: "id",
  username: "username",
  email: "email",
  firstName: "first_name",
  lastName: "last_name",
  ...timestamps
};

export type UserConstructorArgs = { [k in keyof User]?: User[k] };

export const userTableName = "users";

export const PASSWORD_TOO_SHORT_ERROR = "must be at least 5 characters";

// tslint:disable-next-line: no-any
export function makePasswordValidator(errorMessage?: any): Yup.StringSchema {
  return Yup.string()
    .required(errorMessage && errorMessage.required)
    .min(
      userDataLen.passwordMin,
      (errorMessage && errorMessage.min) || PASSWORD_TOO_SHORT_ERROR
    )
    .max(userDataLen.passwordMax, errorMessage && errorMessage.max);
}

export function makeCreateUserSchemaDefinition(
  // tslint:disable-next-line: no-any
  errorMessages: { [k in keyof CreateUserInput]?: any } = {}
): Yup.ObjectSchemaDefinition<CreateUserInput> {
  return {
    username: Yup.string()
      .required(errorMessages.username && errorMessages.username.required)
      .min(
        userDataLen.usernameMin,
        errorMessages.username &&
          (errorMessages.username.min || errorMessages.username.required)
      )
      .max(
        userDataLen.usernameMax,
        errorMessages.username &&
          (errorMessages.username.max || errorMessages.username.required)
      ),

    email: Yup.string()
      .required(errorMessages.email && errorMessages.email.required)
      .email(
        errorMessages.email &&
          (errorMessages.email.email || errorMessages.email.required)
      ),

    firstName: Yup.string(),

    lastName: Yup.string(),

    password: makePasswordValidator(errorMessages.password)
  };
}

export const CreateUserValidator = Yup.object<CreateUserInput>().shape<
  CreateUserInput
>(makeCreateUserSchemaDefinition());
