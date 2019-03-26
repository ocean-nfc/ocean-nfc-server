import { Database } from './../classes/database';
import { Exception } from './../exceptions';
import * as express from "express";

/*
export const listAllClients: express.RequestHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // add the information to the database
  const db: Database = Database.getInstance();

  try {
    const clients = await db.getAllClients();
    res.json(clients);
  } catch (e) {
    console.error(e);
    next(new Exception());
    return;
  }

  res.json();
}
*/
import { cardValidator, exampleValidCard} from './../classes/validators';
import { HttpMethod, RouteParam } from './../classes/route';
import { Route } from '../classes/route';

export class ListAllRoute extends Route {
  getEndpoint() { return "/list-all-clients" }
  getMethod() { return HttpMethod.POST; }

  parameters = [
    
  ];

  description = "Lists all clients";

  sideEffects = [
    "None",
  ];

  protected async apiFunction(params) {
     
     const db: Database = Database.getInstance();
    try {
      const clients =  db.getAllClients();
      return clients;
    } catch (e) {
      console.error(e);
      return;
    }
  
  }
}