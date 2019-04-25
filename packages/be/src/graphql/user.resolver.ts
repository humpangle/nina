import { Resolvers, MutationResolvers } from "../apollo.generated";
import { createUser, login } from "../data/models";
import { idToJwt } from "../data/jwt";

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

export const userResolver: Resolvers = {
  Mutation: {
    createUser: createUserResolver,
    login: loginResolver
  },

  User: {
    jwt: user => {
      return idToJwt(user.id);
    }
  }
};
