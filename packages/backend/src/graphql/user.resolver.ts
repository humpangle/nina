import { Resolvers, MutationResolvers } from "@nina/common";

import { createUser, login } from "../data/models";
import { idToJwt } from "../data/jwt";
import { getPasswordRecoveryToken } from "../data/getPasswordRecoveryToken";

const createUserResolver: MutationResolvers["createUser"] = function createUserResolverFn(
  root,
  { input },
  { connection }
) {
  return createUser(connection, input);
};

const loginResolver: MutationResolvers["login"] = function loginResolverFn(
  root,
  { input },
  { connection }
) {
  return login(connection, input);
};
const requestPasswordResetResolver: MutationResolvers["requestPasswordReset"] = function requestPasswordResetResolverFn(
  root,
  { email },
  { connection }
) {
  return getPasswordRecoveryToken(connection, email);
};

export const userResolver: Resolvers = {
  Mutation: {
    createUser: createUserResolver,
    login: loginResolver,
    requestPasswordReset: requestPasswordResetResolver
  },

  User: {
    jwt: user => {
      return idToJwt(user.id);
    }
  }
};
