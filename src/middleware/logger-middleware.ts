import { LogItem } from './../classes/log';
import * as express from "express";

/**
 * Log every request
 * @param req 
 * @param res 
 * @param next 
 */
export const loggerMiddleware: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const logItem: LogItem = {
    time: new Date(),
    parameters: req.query,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    url: req.originalUrl,
    method: req.method,
    headers: req.headers,
  };

  console.log(logItem);
  // TODO: Save log item to log database
  //addToLog() 

  next();
}