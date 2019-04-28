const cypressTypeScriptPreprocessor = require("./cy-ts-preprocessor");
const { createConnection } = require("typeorm");

const { makeTypeormConfig } = require("@nina/typeorm/dist/ormconfig");

let conn;

module.exports = (on, config) => {
  const dbConfig = makeTypeormConfig(config.env);

  on("file:preprocessor", cypressTypeScriptPreprocessor);

  on("task", {
    createConnection: async function() {
      conn = await createConnection(dbConfig);
      return null;
    },

    closeConnection: function() {
      if (conn) {
        conn.close();
      }

      return null;
    }
  });
};
