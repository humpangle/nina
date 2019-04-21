export const TOKEN_KEY = "nina-token-key";
export const SCHEMA_VERSION = "0.0.1"; // Must be a string.
export const SCHEMA_VERSION_KEY = "nina-apollo-schema-version";
export const SCHEMA_KEY = "nina-apollo-cache-persist";
export const USER_KEY = "@39?111688nina8391!43143";
export const SITE_TITLE = "Nina";
export const THEME_COLOR = "#ff5b00";

// istanbul ignore next:
export function makeSiteTitle(title: string) {
  // istanbul ignore next:
  return `${title} | ${SITE_TITLE}`;
}

// istanbul ignore next:
export function noOp() {
  // istanbul ignore next:
  return null;
}
