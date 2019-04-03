import { CardManager } from "./../classes/card";
import {
  exampleValidClientId,
  clientIdValidator,
  exampleValidClientId2,
  exampleValidCard,
  exampleValidRfid,
  exampleValidPin
} from "./../classes/validators";
import { RouteParam } from "./../classes/route";
import { HttpMethod } from "../classes/route";
import { Route } from "../classes/route";
import { ClientIdNotFoundException } from "../exceptions";

export class UpdateClientRoute extends Route {
  getEndpoint() {
    return "/update-client";
  }
  getMethod() {
    return HttpMethod.POST;
  }

  parameters = [
    new RouteParam(
      "IDS",
      `["${exampleValidClientId}", "${exampleValidClientId2}"]`,
      async val => {
        return Array.isArray(val);
      }
    ),
    new RouteParam(
      "Operation",
      "CREATE",
      async val => val == "CREATE" || val == "DELETE"
    )
  ];

  description = `Updates clients according to the specified operation.
    To be called by Client Information System.`;

  exampleResponses = [
    [
      {
        clientId: exampleValidClientId,
        cardNumber: exampleValidCard,
        rfid: exampleValidRfid,
        pin: exampleValidPin
      }
    ],
    {
      ...new ClientIdNotFoundException()
    }
  ];

  async apiFunction(params) {
    console.log("UPDATE PARAMS", params);

    if (params.Operation == "DELETE") {
      for (const id of params.IDS) {
        await this.db.removeCard("clientId", id);
      }
    }
    else if (params.Operation == "CREATE") {
      const res = [];

      for (const id of params.IDS) {
        res.push({
          ...await CardManager.createNewCard(id),
          clientId: id
        });
        res.push({
          ...await CardManager.createNewCard(id, true),
          clientId: id
        });
      }

      return {
        cards: res
      };
    }
  }
}
