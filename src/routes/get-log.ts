import { Database } from './../classes/database';
import { NotAllParamsSuppliedException, Exception } from './../exceptions';
import * as express from "express";

export const getLog: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  if (!startDate || !endDate) {
    return next(new NotAllParamsSuppliedException());
  }

  // try parse the dates. If they are invalid, then we simply
  try {
    startDate = parseInt(startDate);
    endDate = parseInt(endDate);
  } catch (e) {
    console.error(e, "invalid date");
    return next(new NotAllParamsSuppliedException());
  }

  if (startDate > endDate) {
    return next(new NotAllParamsSuppliedException());
  }

  console.log(startDate, endDate);

  // get the rows from the database
  const db: Database = Database.getInstance();

  try {
    const log = await db.getLogForDates(startDate, endDate);
    res.json(log);
  } catch (e) {
    console.error("error:", e);
    next(new Exception());
  }

}