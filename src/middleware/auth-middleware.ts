import { AuthException } from './../exceptions';
import * as express from "express";


export const authMiddleware: express.RequestHandler = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization;
  
  const authenticated = await isAuthenticated(token);

  next(authenticated ? undefined : new AuthException());
}

function isAuthenticated(token: string): boolean {
  return !!token;
}