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

export const PasswordValidator = Yup.string()
  .required()
  .min(5, PASSWORD_TOO_SHORT_ERROR)
  .max(20);

export const CreateUserSchemaDefinition: Yup.ObjectSchemaDefinition<
  CreateUserInput
> = {
  username: Yup.string()
    .required()
    .min(3)
    .max(15),

  email: Yup.string()
    .required()
    .email(),

  firstName: Yup.string(),

  lastName: Yup.string(),

  password: PasswordValidator
};

export const CreateUserValidator = Yup.object<CreateUserInput>().shape<
  CreateUserInput
>(CreateUserSchemaDefinition);
