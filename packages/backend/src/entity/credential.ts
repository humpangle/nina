import { EntitySchema } from "typeorm";

import {
  Credential,
  credentialTableName,
  credentialEntityColumnMapping
} from "@nina/common";
import { TimestampsEntity, IdEntity } from "./utils";

export const CredentialEntity = new EntitySchema<Credential>({
  name: "Credential",

  tableName: credentialTableName,

  columns: {
    ...IdEntity,

    source: {
      type: String,
      name: credentialEntityColumnMapping.source,
      nullable: true
    },

    encryptedToken: {
      type: String,
      name: credentialEntityColumnMapping.encryptedToken
    },

    ...TimestampsEntity
  },

  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      lazy: true,
      persistence: false,
      onDelete: "CASCADE",
      joinColumn: {
        name: credentialEntityColumnMapping.user
      }
    }
  }
});
