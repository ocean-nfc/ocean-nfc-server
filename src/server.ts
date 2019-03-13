//test
import { authMiddleware } from './middleware/auth-middleware';
import * as express from "express";
import { config } from "./config";
import { getClientId } from "./routes/get-client-id";
import { errorHandler } from './middleware/error-handler';
import { loggerMiddleware } from './middleware/logger-middleware';

export class Server {  
  private app: express.Application;

  constructor() {
    this.app = express();

    this.registerMiddleware();
    this.registerRoutes();
    this.app.use(errorHandler);
    this.listen();
  }

  registerRoutes() {
    this.app.get("/", (req, res) => {
      res.send("Ocean NFC system");
    });
    
    this.app.get("/get-client-id", getClientId);
  }

  registerMiddleware() {
    this.app.use(loggerMiddleware);
    this.app.use(authMiddleware);
  }

  listen() {
    this.app.listen(config.port);
    console.log(`Ocean NFC is listening on port ${config.port}`);
    console.log("Press CTRL+C to stop");
  }

}