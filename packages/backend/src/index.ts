// tslint:disable: no-console
import { createConnection, Connection } from "typeorm";
import Graceful from "node-graceful";
import { Server } from "http";

import { setupServer } from "./server-setup";
import { getTypeormConfigForConnection } from "@nina/typeorm/dist/make-ormconfig";

const PORT = process.env.PORT || "";

if (!PORT) {
  throw new Error("'PORT' environment variable not found");
}

(async function startApp() {
  try {
    const connection = await createConnection(getTypeormConfigForConnection());
    const { webServer } = setupServer(connection);

    webServer.listen(PORT, () => {
      console.log(
        `
        -----------------------------------------------------------------
        | Apollo server is now running at http://127.0.0.1:${PORT}/graphql |
        -----------------------------------------------------------------
        `
      );
    });

    const shutdownListener = onShutdownListener(webServer, connection, PORT);

    Graceful.on("SIGTERM", shutdownListener, true);
    Graceful.on("SIGINT", shutdownListener, true);
    Graceful.on("SIGBREAK", shutdownListener, true);
    Graceful.on("SIGHUP", shutdownListener, true);
    Graceful.on("SIGUSR2", shutdownListener, true); // nodemon
    Graceful.on("shutdown", shutdownListener, false); // tests
  } catch (error) {
    console.error(
      "\n\nError connecting to database and starting apollo server:\n\t\t",
      error
    );
  }
})();

function onShutdownListener(
  server: Server,
  dbConnection: Connection,
  port: string
) {
  // tslint:disable-next-line: no-any
  return function(done: () => void, event: any, signal: any) {
    console.warn(`!)\tGraceful ${signal} signal received.`);

    return new Promise(resolve => {
      console.warn(`3)\tHTTP & WebSocket servers on port ${port} closing.`);
      return server.close(resolve);
    })

      .then(() => {
        console.warn(`2)\tDatabase connections closing.`);
        return dbConnection.close();
      })
      .then(() => {
        console.warn(`1)\tShutting down. Goodbye!\n`);
        return done();
      })
      .catch(err => {
        console.error("!)\tGraceful termination error\n", err);
        process.exit(1);
      });
  };
}
