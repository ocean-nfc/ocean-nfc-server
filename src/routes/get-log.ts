import { NotAllParamsSuppliedException } from './../exceptions';
import * as express from "express";

export const getLog: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  if (!startDate || !endDate) {
    return next(new NotAllParamsSuppliedException());
  }

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // check if dates are ok and if not, respond with notallparamssuppliedexception

  res.json([]);
}