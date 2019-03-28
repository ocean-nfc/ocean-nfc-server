import { routes } from './routes/__route-list';
import { Database } from './classes/database';
import { corsMiddleware } from './middleware/cors-middleware';
import { loggerMiddleware } from "./middleware/logger-middleware";
import * as express from "express";

import { config } from "./config";
import { errorHandler } from "./middleware/error-handler";
import { home } from './routes/home';
import * as http from "http";
<<<<<<< HEAD
import { Route } from './classes/route';
=======
import { Log } from './classes/log';
>>>>>>> 19747e13fe7123ea10c043dd12e63c6d17eb785b

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

    routes.forEach(route => this.registerRoute(route));
  }

  registerMiddleware() {
    this.app.use(corsMiddleware);
    this.app.use(loggerMiddleware);
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
    await Log.getInstance().reset();
  }

  /**
   * Registers a route
   * @param route 
   */
  private registerRoute(route: Route) {
    route.register(this.app);
  }
}
