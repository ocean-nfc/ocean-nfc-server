import { NotAllParamsSuppliedException } from './../exceptions';
import * as express from "express";
import { ClientIdNotFoundException, Exception } from "../exceptions";
import { Database } from '../classes/database';

export const getClientIdFromRfid: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const rfid = req.query.rfid;
  if (!rfid) {
    return next(new NotAllParamsSuppliedException());
  }

  const db = Database.getInstance();

  try {
    try {
      const id = await db.getClientIdByRfid(rfid);
      res.json({
        clientId: id
      });
    }
    catch (e) {
      if (e instanceof ClientIdNotFoundException) {
        return next(e);
      }
      throw e;
    }
  } catch (e) {
    console.error("error:", e);
    return next(new Exception());
  }
}