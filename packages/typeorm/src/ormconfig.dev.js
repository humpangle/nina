var path = require("path");
exports.makeTypeormConfig = function makeTypeormConfigFn(_a) {
    var _b = _a === void 0 ? {} : _a, DATABASE_URL = _b.DATABASE_URL, JS = _b.JS, SYNC = _b.SYNC, DROP_SCHEMA = _b.DROP_SCHEMA, LOG = _b.LOG;
    var js = JS === "true" || JS === true || process.env.JS === "true";
    var root = path.resolve(__dirname, "..", js ? "dist" : "src");
    var fileSuffix = js ? "js" : "ts";
    return {
        type: "postgres",
        url: DATABASE_URL || process.env.DATABASE_URL,
        logging: !!(LOG || process.env.LOG),
        synchronize: !!(SYNC || process.env.SYNC),
        dropSchema: !!(DROP_SCHEMA || process.env.DROP_SCHEMA),
        entities: [root + "/entity/**/*." + fileSuffix],
        migrations: [root + "/migration/**/*." + fileSuffix],
        subscribers: [root + "/subscriber/**/*." + fileSuffix],
        cli: {
            entitiesDir: root + "/entity",
            migrationsDir: root + "/migration",
            subscribersDir: root + "/subscriber"
        }
    };
};
