import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import { REGISTER_USER_FRAGMENT } from "../graphql/register-user.fragment";
import { RegisterUserFragment } from "../apollo-generated";

export const USER_LOCAL_QUERY = gql`
  query UserLocalQuery {
    user @client {
      ...RegisterUser
    }

    staleToken @client
  }

  ${REGISTER_USER_FRAGMENT}
`;

export interface UserLocalGqlData {
  user?: RegisterUserFragment;
  staleToken?: string | null;
}

export interface UserLocalGqlProps {
  userLocal?: DataValue<UserLocalGqlData>;
}
