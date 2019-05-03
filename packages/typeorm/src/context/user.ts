import { Connection } from "typeorm";
import { Credential as OriginalCredential, User } from "@nina/common";
import { normalizeDbError } from "./utils";
import { UserEntity } from "../entity/user";
import { CredentialEntity } from "../entity/credential";
import { makeAndWhere } from "./makeAndWhere";

type Credential = OriginalCredential & {
  __user__: User | null; // added by typeorm leftJoinAndSelect
};

function getUserRepo(connection: Connection) {
  return connection.getRepository<User>(UserEntity);
}

export function getCredentialRepo(connection: Connection) {
  return connection.getRepository<Credential>(CredentialEntity);
}

export async function createUser(
  connection: Connection,
  { encryptedToken, ...input }: CreateUserDbInput
): Promise<User> {
  try {
    const user = await getUserRepo(connection).save(input);

    const credentialRepo = getCredentialRepo(connection);

    const credential = (await credentialRepo.save<Partial<Credential>>({
      encryptedToken
    })) as Credential;

    await credentialRepo
      .createQueryBuilder()
      .relation("Credential", "user")
      .of(credential)
      .set(user.id);

    credential.encryptedToken = null;
    user.credential = credential;

    return user;
  } catch (error) {
    throw new Error(normalizeDbError(error.detail));
  }
}

export async function login(
  connection: Connection,
  args: { username?: string | null; email?: string | null }
) {
  let where = "";

  Object.entries(args).forEach(([key, v]) => {
    if (v) {
      const q = `user.${key}=:${key}`;
      if (where === "") {
        where = q;
      } else {
        where += ` AND ${q}`;
      }
    }
  });

  let query = getCredentialRepo(connection)
    .createQueryBuilder("credential")
    .leftJoinAndSelect("credential.user", "user")
    .where(where, args);

  let credential = await query.getOne();
  (query as unknown) = null;

  if (credential) {
    const user = { ...credential.__user__ } as User;

    if (user) {
      delete (credential as Credential).__user__;
      user.credential = credential;

      return user;
    }
  }

  return null;
}

export async function getUserBy(
  connection: Connection,
  whereArgs: Partial<User>
) {
  return getUserRepo(connection)
    .createQueryBuilder("user")
    .where(makeAndWhere(whereArgs, "user"), whereArgs)
    .getOne();
}

export async function updateCredential(
  connection: Connection,
  whereArgs: Partial<Credential>,
  updateArgs: Partial<Credential>
) {
  const query = getCredentialRepo(connection)
    .createQueryBuilder()
    .update(CredentialEntity)
    .set(updateArgs)
    .where(makeAndWhere(whereArgs), whereArgs)
    .returning(Object.keys(updateArgs));

  const { raw } = await query.execute();

  return raw.length === 0 ? false : true;
}

export interface CreateUserDbInput {
  username: string;
  email: string;
  encryptedToken: string;
}
