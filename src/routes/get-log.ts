import * as express from "express";

export const getLog: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.json({
    // something
  });
}