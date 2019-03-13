import { loggerMiddleware } from './middleware/logger-middleware';
import * as express from "express";

import { addCard } from './routes/add-card';
import { getClientIdFromCardNumber } from './routes/get-client-id-from-card-number';
import { getClientIdFromRfid } from './routes/get-client-id-from-rfid';
import { getLog } from './routes/get-log';
import { authMiddleware } from './middleware/auth-middleware';
import { config } from "./config";
import { errorHandler } from './middleware/error-handler';
import { verifyPin } from './routes/verify-pin';
import { updateRfid } from './routes/update-rfid';
import { updatePin } from './routes/update-pin';
import { updateCardNumber } from './routes/update-card-number';

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
    
    this.app.get("/get-client-id-from-rfid", getClientIdFromRfid);
    this.app.get("/get-client-id-from-card-number", getClientIdFromCardNumber);
    this.app.get("/get-log", getLog);
    
    this.app.post("/verify-pin", verifyPin);
    this.app.post("/add-card", addCard);
    this.app.post("/update-rfid", updateRfid);
    this.app.post("/update-pin", updatePin);
    this.app.post("/update-card-number", updateCardNumber);

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