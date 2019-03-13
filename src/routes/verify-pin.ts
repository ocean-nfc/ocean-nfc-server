import { Database } from "./../classes/database";
import { NotAllParamsSuppliedException, Exception } from "./../exceptions";
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";

export const verifyPin: express.RequestHandler = async (
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
      const user = await db.getClient(clientId);
      res.json({
        valid: user.pin == pin
      });
    } catch (e) {
      if (e instanceof ClientIdNotFoundException) {
        return next(e);
      }
      throw e;
    }
  } catch (e) {
    console.error("error:", e);
    return next(new Exception());
  }
};
