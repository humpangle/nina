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
  requestPasswordReset: Scalars["String"];
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationRequestPasswordResetArgs = {
  email: Scalars["String"];
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
import { User } from "../data/user";
import { Credential } from "../data/credential";
import { NinaContext } from "../utils.types";

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: {};
  Boolean: Scalars["Boolean"];
  Mutation: {};
  CreateUserInput: CreateUserInput;
  String: Scalars["String"];
  User: User;
  Date: Scalars["Date"];
  ID: Scalars["ID"];
  Credential: Credential;
  LoginInput: LoginInput;
  Timestamps: Timestamps;
};

export type CredentialResolvers<
  ContextType = NinaContext,
  ParentType = ResolversTypes["Credential"]
> = {
  insertedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  source?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  encryptedToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type MutationResolvers<
  ContextType = NinaContext,
  ParentType = ResolversTypes["Mutation"]
> = {
  createUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    MutationCreateUserArgs
  >;
  login?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    MutationLoginArgs
  >;
  requestPasswordReset?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType,
    MutationRequestPasswordResetArgs
  >;
};

export type QueryResolvers<
  ContextType = NinaContext,
  ParentType = ResolversTypes["Query"]
> = {
  noop?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
};

export type TimestampsResolvers<
  ContextType = NinaContext,
  ParentType = ResolversTypes["Timestamps"]
> = {
  insertedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = NinaContext,
  ParentType = ResolversTypes["User"]
> = {
  insertedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  jwt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  credential?: Resolver<ResolversTypes["Credential"], ParentType, ContextType>;
};

export type Resolvers<ContextType = NinaContext> = {
  Credential?: CredentialResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Timestamps?: TimestampsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = NinaContext> = Resolvers<ContextType>;
