import { Timestamps, timestamps } from "./utils";
import { User } from "./user";

export interface Credential extends Timestamps {
  id: string | number;
  source?: string | null;
  encryptedToken: string | null;
  user?: User | null;
  user_id?: string | number;
}

export const credentialEntityColumnMapping = {
  id: "id",
  source: "source",
  encryptedToken: "encrypted_token",
  user: "user_id",
  ...timestamps
} as { [k in keyof Credential]: string };

export const credentialTableName = "credentials";
