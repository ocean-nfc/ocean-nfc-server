import { ClientCache } from './../classes/client-cache';
//import { CardIdNotFoundException } from './../exceptions';
import * as express from "express";
import { ClientIdNotFoundException } from "../exceptions";

/**
 * GET /get-client-id
 * Params:
 *  - cardId: string - the card ID
 */
export const getClientId: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const cardId = req.query.cardId;
  if (!cardId) {
    //return next(new CardIdNotFoundException());
    return next(new ClientIdNotFoundException());
  }

  const cache = ClientCache.getInstance();
  const clientId = await cache.getClientId(cardId);

  res.json({
    cardId: req.query.cardId,
    clientId: clientId,
  });
}