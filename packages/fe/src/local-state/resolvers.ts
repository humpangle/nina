import { InMemoryCache } from "apollo-cache-inmemory";

import { UserMutationVariable } from "./user.local.mutation";
import { UserLocalGqlData, USER_LOCAL_QUERY } from "./auth.local.query";
// import { resetClientAndPersistor } from "./apollo-setup";
import {
  getToken,
  clearToken,
  storeToken,
  storeUser,
  clearUser
} from "./storage";
import { RegisterUserFragment } from "../apollo-generated";

type ClientStateFn<TVariables> = (
  fieldName: string,
  variables: TVariables,
  context: { cache: InMemoryCache }
) => void;

const userMutation: ClientStateFn<UserMutationVariable> = async (
  _,
  { user },
  { cache }
) => {
  if (user) {
    /**
     * We store user in local storage as a temporary fix because reading user
     * out of apollo local state immediately after login does not seem to work
     */
    storeUser(user);

    cache.writeData({ data: { user, staleToken: null, loggedOutUser: null } });

    storeToken(user.jwt);

    return user;
  }

  // MEANS WE HAVE LOGGED OUT. we store the current user as `loggedOutUser`
  // so we can pre-fill the sign in form with e.g. user email/username

  const { user: loggedOutUser } = {
    ...(cache.readQuery<UserLocalGqlData>({ query: USER_LOCAL_QUERY }) || {
      user: null
    })
  };

  const data = {
    user: null,
    staleToken: null
  } as {
    loggedOutUser?: RegisterUserFragment | null;
  };

  if (loggedOutUser) {
    // await resetClientAndPersistor();
    data.loggedOutUser = loggedOutUser;
  }

  clearUser();

  await cache.writeData({
    data
  });

  clearToken();

  return loggedOutUser;
};

export interface LocalState {
  staleToken: string | null;
  user: null;
  loggedOutUser: null;
}

export function initState() {
  return {
    resolvers: {
      Mutation: {
        user: userMutation
      }
    },

    defaultState: {
      staleToken: getToken(),
      user: null,
      loggedOutUser: null
    }
  };
}
