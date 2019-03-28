import { Log } from '../classes/log';
import * as express from "express";

/**
 * Log every request
 * @param req 
 * @param res 
 * @param next 
 */
export const loggerMiddleware: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.on("finish", function() {
    const logItem = [
      Math.round(Date.now() / 1000),
      res.statusCode,
      req.method,
      req.originalUrl,
      JSON.stringify(req.query),
      req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    ];
  
    console.log(logItem.join(" "));
    
    const log = Log.getInstance();
    log.addLogItem(logItem);
  })

  next();
}