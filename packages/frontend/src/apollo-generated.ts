export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};

export type CreateUserInput = {
  username: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
};

export type Credential = {
  insertedAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  id: Scalars["ID"];
  source?: Maybe<Scalars["String"]>;
  encryptedToken: Scalars["String"];
};

export type LoginInput = {
  username?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  password: Scalars["String"];
};

export type Mutation = {
  createUser: User;
  login: User;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type Query = {
  noop?: Maybe<Scalars["Boolean"]>;
};

export type Timestamps = {
  insertedAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
};

export type User = {
  insertedAt: Scalars["Date"];
  updatedAt: Scalars["Date"];
  id: Scalars["ID"];
  username: Scalars["String"];
  email: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  jwt: Scalars["String"];
  credential: Credential;
};
export type RegisterUserFragment = { __typename?: "User" } & Pick<
  User,
  "id" | "username" | "email" | "jwt"
>;

export type RegisterUserMutationVariables = {
  input: CreateUserInput;
};

export type RegisterUserMutation = { __typename?: "Mutation" } & {
  createUser: { __typename?: "User" } & RegisterUserFragment;
};
