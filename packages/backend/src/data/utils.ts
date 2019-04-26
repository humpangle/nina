import bcrypt from "bcrypt-nodejs";

export function hashSync(token: string) {
  return bcrypt.hashSync(token, bcrypt.genSaltSync(8));
}

export function verifyHashSync(token: string, tokenHash: string) {
  return bcrypt.compareSync(token, tokenHash);
}
