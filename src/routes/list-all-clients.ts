import { Database } from "./../classes/database";

import { HttpMethod } from "./../classes/route";
import { Route } from "../classes/route";

export class ListAllRoute extends Route {
  getEndpoint() {
    return "/list-all-clients";
  }
  getMethod() {
    return HttpMethod.POST;
  }

  description = "Lists all clients";

  sideEffects = [];

  protected async apiFunction(params) {
    const db: Database = Database.getInstance();
    try {
      const clients = db.getAllClients();
      return clients;
    } catch (e) {
      console.error(e);
      return;
    }
  }
}
