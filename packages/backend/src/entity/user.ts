import "reflect-metadata";
import { EntitySchema } from "typeorm";

import { User, userEntityColumnMapping, userTableName } from "@nina/common";
import { TimestampsEntity, IdEntity } from "./utils";

export const UserEntity = new EntitySchema<User>({
  name: "User",

  tableName: userTableName,

  columns: {
    ...IdEntity,

    username: {
      type: "citext",
      name: userEntityColumnMapping.username,
      unique: true
    },

    email: {
      type: String,
      name: userEntityColumnMapping.email,
      unique: true
    },

    firstName: {
      type: String,
      name: userEntityColumnMapping.firstName,
      nullable: true
    },

    lastName: {
      type: String,
      name: userEntityColumnMapping.lastName,
      nullable: true
    },

    ...TimestampsEntity
  },

  relations: {
    credential: {
      type: "one-to-one",
      target: "Credential",
      lazy: true
    }
  }
});
