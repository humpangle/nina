import { EntitySchemaColumnOptions } from "typeorm";

import { Timestamps } from "@nina/common/dist/data/utils";

export const TimestampsEntity: {
  [k in keyof Timestamps]: EntitySchemaColumnOptions
} = {
  insertedAt: {
    name: "inserted_at",
    type: "timestamp without time zone",
    createDate: true
  },

  updatedAt: {
    name: "updated_at",
    type: "timestamp without time zone",
    updateDate: true
  }
};

export const IdEntity: { id: EntitySchemaColumnOptions } = {
  id: {
    type: Number,
    primary: true,
    generated: true
  }
};
