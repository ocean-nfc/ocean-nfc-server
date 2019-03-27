import { Database } from './../classes/database';
import { NotAllParamsSuppliedException, Exception } from './../exceptions';
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";
import {AuthException} from "../exceptions";

export const verifyPin: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const cardId = req.query.cardId;
  const pin = req.query.pin;
  if (!cardID || !pin) {
    return next(new NotAllParamsSuppliedException());
  }


  const db = Database.getInstance();

  try {
    const users = await db.all("SELECT * FROM db WHERE (cardNumber=?)", [cardId]);
    if (users.length === 0) {
      return next(new AuthException());//card not found
    }
    if (users[0].pin == pin)
    {
      res.json({users[0].clientId, "AUTHENTICATION SUCCESS"});//card found, pin matches
    }
    else
    {
      res.json({users[0].clientId, "AUTHENTICATION FAILURE"});//card found, pin incorrect
    }
  } catch (e) {
    console.error("error:", e);
    return next(new Exception());
  }
}