export interface Timestamps {
  insertedAt: Date;
  updatedAt: Date;
}

export const timestamps: { [k in keyof Timestamps]: string } = {
  updatedAt: "updated_at",
  insertedAt: "inserted_at"
};

export type ID = number | string;
