import { Database } from './../classes/database';
import { NotAllParamsSuppliedException, ClientIdNotFoundException, Exception } from './../exceptions';
import * as express from "express";

export const updateCardNumber: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.query.clientId;
  const cardNumber = req.query.cardNumber;
  if (!clientId || !cardNumber) {
    return next(new NotAllParamsSuppliedException());
  }

  const db = Database.getInstance();

  try {
    try {
      console.log("updating card number");
      await db.updateClientCardNumber(clientId, cardNumber);
      console.log("updated card number");
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
}