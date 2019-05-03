export function makeAndWhere<T extends object>(args: T, prefix?: string) {
  prefix = prefix ? prefix + "." : "";

  return Object.keys(args).reduce((acc, key) => {
    if (args[key as keyof T] === undefined) {
      return acc;
    }

    const k = `${prefix}${key} = :${key}`;

    if (acc === "") {
      return k;
    }

    return `${acc} AND ${k}`;
  }, "");
}
