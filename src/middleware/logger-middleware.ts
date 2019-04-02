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

    req.originalUrl = req.originalUrl.replace(/pin=\d+/,"pin=undifined");//This is to mask the pin (security purposes)

    if(req.query['pin'] != null)
      req.query['pin'] = "undifined"; //This is to mask the pin (security purposes)

    const logItem = [
      Date.now(),
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