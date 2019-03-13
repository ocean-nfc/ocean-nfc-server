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
    const users = await db.all("SELECT * FROM db WHERE (rfid=?)", [rfid]);
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