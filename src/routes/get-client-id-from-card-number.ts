import { NotAllParamsSuppliedException } from './../exceptions';
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";

export const getClientIdFromCardNumber: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const cardNumber = req.query.cardNumber;
  if (!cardNumber) {
    return next(new NotAllParamsSuppliedException());
  }

  // if client not found next(new ClientIdNotFoundException())

  res.json({
    clientId: null,
  });
}