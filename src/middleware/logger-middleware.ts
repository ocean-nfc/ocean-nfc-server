import { Database } from './../classes/database';
import * as express from "express";

/**
 * Log every request
 * @param req 
 * @param res 
 * @param next 
 */
export const loggerMiddleware: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const logItem = [
    new Date().getTime(),
    res.statusCode,
    req.method,
    req.originalUrl,
    JSON.stringify(req.query),
    req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  ];

  console.log(logItem.join(" "));
  
  const db = Database.getInstance();
  db.addLogItem(logItem[0], logItem[1], logItem[2], logItem[3], logItem[4].toString(), logItem[5]);

  next();
}