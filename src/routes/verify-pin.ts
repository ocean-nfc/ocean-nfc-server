import { Database } from "./../classes/database";
import { NotAllParamsSuppliedException, Exception } from "./../exceptions";
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";
import {AuthException} from "../exceptions";

<<<<<<< HEAD
export const verifyPin: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const cardId = req.query.cardId;
=======
export const verifyPin: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const clientId = req.query.clientId;
>>>>>>> development
  const pin = req.query.pin;
  if (!cardID || !pin) {
    return next(new NotAllParamsSuppliedException());
  }

<<<<<<< HEAD

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
=======
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
>>>>>>> development
    }
  } catch (e) {
    console.error("error:", e);
    return next(new Exception());
  }
};
