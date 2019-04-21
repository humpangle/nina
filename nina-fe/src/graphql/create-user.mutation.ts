import gql from 'graphql-tag'

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      jwt
    }
  }
`