import * as winston from "winston";
import BrowserConsole from "winston-transport-browserconsole";

const IS_DEV = process.env.NODE_ENV === "development";

const winstonLogger = winston.createLogger({
  level: "debug",

  transports: [
    new BrowserConsole({
      format: winston.format.simple(),
      level: "debug"
      // tslint:disable-next-line: no-any
    }) as any
  ],

  exitOnError: false,

  format: winston.format.simple()
});

export const logGraphql = async function logGraphqlFn(
  operationName: string,
  // tslint:disable-next-line: no-any
  obj: any,
  isResponse?: boolean | string
) {
  if (!IS_DEV) {
    return;
  }

  let msgPrefix = "Query/mutation";
  let level = "info";

  if (isResponse) {
    if (typeof isResponse === "string") {
      msgPrefix = `[${isResponse} error] from Apollo operation:`;
      level = "error";
    } else {
      msgPrefix = "Received response from";
    }
  }

  const message = `==============${msgPrefix} ${operationName}============\n`;
  // tslint:disable-next-line: no-any
  const meta: any = [
    obj,
    `\n==========End ${msgPrefix} ${operationName}=============`
  ];

  winstonLogger.log(level, message, meta);
};
