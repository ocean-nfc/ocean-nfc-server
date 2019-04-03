import { CardManager } from './../classes/card';
import {
  exampleValidClientId,
  clientIdValidator
} from "./../classes/validators";
import { RouteParam } from "./../classes/route";
import { HttpMethod } from "../classes/route";
import { Route } from "../classes/route";

export class UpdateClientRoute extends Route {
  getEndpoint() {
    return "/update-client";
  }
  getMethod() {
    return HttpMethod.POST;
  }

  parameters = [
    new RouteParam("ID", exampleValidClientId, clientIdValidator),
    new RouteParam(
      "Operation",
      "CREATE",
      async val => val == "CREATE" || val == "DELETE"
    )
  ];

  description = `Updates clients according to the specified operation.
    To be called by Client Information System.`;

  exampleResponses = [
    {
      success: true
    },
    {
      success: false
    }
  ];

  async apiFunction(params) {
    console.log("UPDATE PARAMS", params);
    if (params.Operation == "DELETE") {
      await this.db.removeCard("clientId", params.ID);
    }
    if (params.Operation == "CREATE") {
      await CardManager.createNewCard(params.ID);
      await CardManager.createNewCard(params.ID, true);
    }
  }
}
