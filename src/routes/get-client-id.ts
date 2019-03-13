import * as express from "express";

/**
 * GET /get-client-id
 * Params:
 *  - cardId: string - the card ID
 */
export const getClientId: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const cardId = req.query.cardId;
  if (!cardId) {
    return next({ error: true, message: "CARD_ID_NOT_SUPPLIED" });
  }

  res.json({
    cardId: req.query.cardId,
    clientId: await new Promise(resolve => setTimeout(() => resolve("1234"), 1000)),
  });
}