import { Database } from './../classes/database';
import { NotAllParamsSuppliedException, Exception, ClientIdNotFoundException } from './../exceptions';
import * as express from "express";

export const removeCard: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.query.clientId;
  if (!clientId) {
    return next(new NotAllParamsSuppliedException());
  }

  // remove information from the database
  const db: Database = Database.getInstance();

  try {
    try {
      await db.removeCard(clientId);
    } catch (e) {
      if (e instanceof ClientIdNotFoundException) {
        return next(e);
      }
      throw e;
    }
  } catch (e) {
    console.error(e);
    next(new Exception());
    return;
  }

  res.json();
}