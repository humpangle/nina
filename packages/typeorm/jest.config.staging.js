module.exports = {
  testEnvironment: "node",
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/dist/migration/",
    "<rootDir>/dist/winston-logger.js",
    "<rootDir>/dist/make-ormconfig.js"
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  testRegex: "dist/__tests__/.+?\\.test\\.js$",
  globals: {
    __PATH_PREFIX__: ""
  }
};
