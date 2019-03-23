import { Database } from './classes/database';
import { corsMiddleware } from './middleware/cors-middleware';
import { loggerMiddleware } from "./middleware/logger-middleware";
import * as express from "express";

import { getClientIdFromCardNumber } from "./routes/get-client-id-from-card-number";
import { getClientIdFromRfid } from "./routes/get-client-id-from-rfid";
import { getLog } from "./routes/get-log";
import { authMiddleware } from "./middleware/auth-middleware";
import { config } from "./config";
import { errorHandler } from "./middleware/error-handler";
import { verifyPin } from "./routes/verify-pin";
import { updateRfid } from "./routes/update-rfid";
import { updatePin } from "./routes/update-pin";
import { updateCardNumber } from "./routes/update-card-number";
import { removeCard } from "./routes/remove-card";
import { listAllClients } from "./routes/list-all-clients";
import { home } from './routes/home';
import * as http from "http";
import { AddCardRoute } from './routes/add-card';
import { Route } from './classes/route';

export class Server {
  private app: express.Application;
  private server: http.Server;

  public async start() {
    this.app = express();

    this.registerMiddleware();
    this.registerRoutes();
    this.app.use(errorHandler);
    await this.listen();
  }

  registerRoutes() {
    this.app.get("/", home);

    this.registerRoute(new AddCardRoute());

    this.app.get("/get-client-id-from-rfid", getClientIdFromRfid);
    this.app.get("/get-client-id-from-card-number", getClientIdFromCardNumber);
    this.app.get("/get-log", getLog);
    this.app.get("/list-all-clients", listAllClients)

    this.app.post("/verify-pin", verifyPin);
    this.app.post("/update-rfid", updateRfid);
    this.app.post("/update-pin", updatePin);
    this.app.post("/update-card-number", updateCardNumber);
    this.app.post("/remove-card", removeCard);
  }

  registerMiddleware() {
    this.app.use(corsMiddleware);
    this.app.use(loggerMiddleware);
    // this.app.use(authMiddleware);
  }

  listen() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(config.port, () => {
        console.log(`Ocean NFC is listening on port ${config.port}`);
        console.log("Press CTRL+C to stop");
        resolve();
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public static async reset() {
    await Database.getInstance().reset();
  }

  /**
   * Registers a route
   * @param route 
   */
  private registerRoute(route: Route) {
    route.register(this.app);
  }
}
