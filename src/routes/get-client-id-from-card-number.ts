import { Database } from "./../classes/database";
import { NotAllParamsSuppliedException, Exception } from "./../exceptions";
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";

export const getClientIdFromCardNumber: express.RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const cardNumber = req.query.cardNumber;
  if (!cardNumber) {
    return next(new NotAllParamsSuppliedException());
  }

  const db = Database.getInstance();

  try {
    try {
      const id = await db.getClientIdByCardNumber(cardNumber);
      res.json({
        clientId: id
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
