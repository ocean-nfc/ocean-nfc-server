import {
  NotAllParamsSuppliedException,
  ClientIdNotFoundException,
  Exception
} from "./../exceptions";
import * as express from "express";
import { Database } from "../classes/database";

export const updatePin: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const clientId = req.query.clientId;
  const pin = req.query.pin;
  if (!clientId || !pin) {
    return next(new NotAllParamsSuppliedException());
  }

  const db = Database.getInstance();

  try {
    try {
      await db.updateClientPin(clientId, pin);
      res.json();
    } catch (e) {
      if (e instanceof ClientIdNotFoundException) {
        return next(e);
      }
      throw e;
    }
  } catch (e) {
    console.error(e);
    return next(new Exception());
  }
};
