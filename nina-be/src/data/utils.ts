import bcrypt from "bcrypt-nodejs";

export interface Timestamps {
  insertedAt: Date;
  updatedAt: Date;
}

export const timestamps: { [k in keyof Timestamps]: string } = {
  updatedAt: "updated_at",
  insertedAt: "inserted_at"
};

export function hashSync(token: string) {
  return bcrypt.hashSync(token, bcrypt.genSaltSync(8));
}

export function verifyHashSync(token: string, tokenHash: string) {
  return bcrypt.compareSync(token, tokenHash);
}

export const INVALID_INPUT_ERROR_TITLE = "invalid input";

export type ID = number | string;
