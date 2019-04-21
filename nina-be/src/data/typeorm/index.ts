export {
  createUser as dbCreateUser,
  login as dbLogin,
  getUserById as dbGetUserById,
  getUserByEmail as dbGetUserByEmail,
  // getCredentialByUserId as dbGetCredentialByUserId,
  updateCredential as dbUpdateCredential
} from "./user";
