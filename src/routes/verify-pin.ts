import { NotAllParamsSuppliedException } from './../exceptions';
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";

export const verifyPin: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.query.userId;
  const pin = req.query.pin;
  if (!userId || !pin) {
    return next(new NotAllParamsSuppliedException());
  }

  // if the user doesn't exist next(new ClientNotFoundException())

  const isPinValid = false; // actually perform validation

  res.json({
    valid: isPinValid,
  });
}