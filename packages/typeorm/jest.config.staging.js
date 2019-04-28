module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/.+?db.test.ts"
  ],
  testRegex: "dist/__tests__/.+?\\.test\\.js$",
  globals: {
    __PATH_PREFIX__: ""
  }
};
