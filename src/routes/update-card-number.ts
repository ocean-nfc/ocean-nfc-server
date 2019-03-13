import { NotAllParamsSuppliedException } from './../exceptions';
import * as express from "express";

export const updateCardNumber: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.query.clientId;
  const cardNumber = req.query.cardNumber;
  if (!clientId || !cardNumber) {
    return next(new NotAllParamsSuppliedException());
  }

  // if couldn't find client next(new ClientIdNotFoundException())

  // update the card number

  res.json();
}