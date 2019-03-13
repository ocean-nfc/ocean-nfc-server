import { NotAllParamsSuppliedException } from './../exceptions';
import * as express from "express";

export const updatePin: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.query.clientId;
  const pin = req.query.pin;
  if (!clientId || !pin) {
    return next(new NotAllParamsSuppliedException());
  }

  // if couldn't find client next(new ClientIdNotFoundException())

  // update the pin

  res.json();
}