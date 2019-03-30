import * as express from "express";
import { Exception } from "../exceptions";

export function errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (err instanceof Exception) {
    res.status(err.code).json(err);
  }
  else {
    res.status(500).json(err);
  }
}