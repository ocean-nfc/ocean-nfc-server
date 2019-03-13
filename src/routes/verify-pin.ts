import { Database } from './../classes/database';
import { NotAllParamsSuppliedException, Exception } from './../exceptions';
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";

export const verifyPin: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.query.clientId;
  const pin = req.query.pin;
  if (!clientId || !pin) {
    return next(new NotAllParamsSuppliedException());
  }

  // if the user doesn't exist next(new ClientNotFoundException())

  const db = Database.getInstance();

  try {
    const users = await db.all("SELECT * FROM db WHERE (clientId=?)", [clientId]);
    if (users.length === 0) {
      return next(new ClientIdNotFoundException());
    }
    res.json({
      valid: users[0].pin == pin
    });
  } catch (e) {
    console.error("error:", e);
    return next(new Exception());
  }
}