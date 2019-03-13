import { Database } from './../classes/database';
import { NotAllParamsSuppliedException, Exception } from './../exceptions';
import * as express from "express";

export const addCard: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.query.clientId;
  const rfid = req.query.rfid;
  const pin = req.query.pin;
  const cardNumber = req.query.cardNumber;
  if (!clientId || !rfid || !pin || !cardNumber) {
    return next(new NotAllParamsSuppliedException());
  }

  // add the information to the database
  const db: Database = Database.getInstance();

  try {
    await db.run(`INSERT INTO db VALUES (?, ?, ? ,?)`, [clientId, rfid, cardNumber, pin]);
    console.log(await db.run(`SELECT * FROM db`));
  } catch (e) {
    console.error(e);
    next(new Exception());
    return;
  }

  res.json();
}