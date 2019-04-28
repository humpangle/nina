import { GENERIC_DB_ERROR } from "@nina/common";

/**
 * 'Key (field_name)=(value) error explanation.'
 */
const DB_ERROR_PATTERN = /^.+?\((.+?)\)=\(.+?\)\s*(.+)$/;

/**
 * The errorString returned from typeorm is of the form
 * 'Key (field_name)=(value) error explanation.'
 * (see regex pattern above).
 * We transform it into JSON string from object:
 *  {field_name: 'error explanation'}
 */
export function normalizeDbError(errorString: string) {
  const exec = DB_ERROR_PATTERN.exec(errorString);

  if (exec) {
    const [, fieldName, errorExplanation] = exec;
    return JSON.stringify({ [fieldName]: errorExplanation });
  }

  /* istanbul ignore next: */
  return GENERIC_DB_ERROR;
}
