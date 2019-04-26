import jwt from "jsonwebtoken";
import { Connection } from "typeorm";

import { ID, DEFAULT_JWT_EXPIRATION } from "@nina/common";
import { getUserById } from "./models";

const SECRET = process.env.SECRET || "";

// istanbul ignore next
if (!SECRET || SECRET.length < 3) {
  throw new Error('Invalid "SECRET" key');
}

export async function userFromJwt(connection: Connection, token: string) {
  const { id: id } = (await jwt.verify(token, SECRET)) as { id: string };

  return await getUserById(connection, id);
}

export function idToJwt(id: ID, expiresIn: string = DEFAULT_JWT_EXPIRATION) {
  return jwt.sign({ id: "" + id }, SECRET, { expiresIn });
}
