import { Database } from './../classes/database';
import { NotAllParamsSuppliedException, Exception } from './../exceptions';
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";

export const getClientIdFromCardNumber: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const cardNumber = req.query.cardNumber;
  if (!cardNumber) {
    return next(new NotAllParamsSuppliedException());
  }

  const db = Database.getInstance();

  try {
    const users = await db.all("SELECT * FROM db WHERE (cardNumber=?)", [cardNumber]);
    if (users.length === 0) {
      return next(new ClientIdNotFoundException());
    }
    res.json({
      clientId: users[0].clientId
    });
  } catch (e) {
    console.error("error:", e);
    return next(new Exception());
  }
}