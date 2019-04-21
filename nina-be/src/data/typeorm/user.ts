import { Connection } from "typeorm";
import { User } from "../user";
import { Credential as OriginalCredential } from "../credential";
import { UserEntity } from "../../entity/user";
import { CredentialEntity } from "../../entity/credential";
import { CreateUserInput } from "../../apollo.generated";
import { hashSync, ID } from "../utils";
import { normalizeDbError } from "./utils";

type Credential = OriginalCredential & {
  __user__: User | null; // added by typeorm leftJoinAndSelect
};

function getUserRepo(connection: Connection) {
  return connection.getRepository<User>(UserEntity);
}

function getCredentialRepo(connection: Connection) {
  return connection.getRepository<Credential>(CredentialEntity);
}

export async function createUser(
  connection: Connection,
  { password, ...input }: CreateUserInput
): Promise<User> {
  try {
    const user = await getUserRepo(connection).save(input);

    const repo = getCredentialRepo(connection);

    const credential = (await repo.save<Partial<Credential>>({
      encryptedToken: hashSync(password)
    })) as Credential;

    await repo
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

export async function getUserById(connection: Connection, id: ID) {
  return getUserRepo(connection).findOne(id);
}

export async function getUserByEmail(connection: Connection, email: string) {
  return getUserRepo(connection)
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .getOne();
}

// export function getCredentialByUserId(connection: Connection, userId: ID) {
//   return getCredentialRepo(connection)
//     .createQueryBuilder("credential")
//     .where("credential.user_id = :userId", { userId })
//     .getOne();
// }

export async function updateCredential(
  connection: Connection,
  whereArgs: Partial<Credential>,
  updateArgs: Partial<Credential>
) {
  const where = Object.keys(whereArgs).reduce((acc, key) => {
    const k = `${key} = :${key}`;

    if (acc === "") {
      return k;
    }
    return `${acc} AND ${k}`;
  }, "");

  const { raw } = await getCredentialRepo(connection)
    .createQueryBuilder()
    .update(CredentialEntity)
    .set(updateArgs)
    .where(where, whereArgs)
    .returning(Object.keys(updateArgs))
    .execute();

  return raw.length === 0 ? false : true;
}
