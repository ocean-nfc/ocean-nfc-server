import { Database } from './../classes/database';
import { NotAllParamsSuppliedException, ClientIdNotFoundException, Exception } from './../exceptions';
import * as express from "express";

export const updateRfid: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.query.clientId;
  const rfid = req.query.rfid;
  if (!clientId || !rfid) {
    return next(new NotAllParamsSuppliedException());
  }

  const db = Database.getInstance();

  try {
    try {
      await db.updateClientRfid(clientId, rfid);
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