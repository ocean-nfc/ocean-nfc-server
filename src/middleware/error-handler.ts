import * as express from "express";

export function errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(err.code).json(err);
}