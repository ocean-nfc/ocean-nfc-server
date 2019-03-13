import { NotAllParamsSuppliedException } from './../exceptions';
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";

export const getClientIdFromRfid: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const rfid = req.query.rfid;
  if (!rfid) {
    return next(new NotAllParamsSuppliedException());
  }

  // if couldn't find client next(new ClientIdNotFoundException())

  res.json({
    clientId: null,
  });
}