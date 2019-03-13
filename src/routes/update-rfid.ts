import { NotAllParamsSuppliedException } from './../exceptions';
import * as express from "express";

export const updateRfid: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.query.clientId;
  const rfid = req.query.rfid;
  if (!clientId || !rfid) {
    return next(new NotAllParamsSuppliedException());
  }

  // if couldn't find client next(new ClientIdNotFoundException())

  // update the pin
  
  res.json();
}