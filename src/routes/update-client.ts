import { CardManager } from "./../classes/card";
import {
  exampleValidClientId,
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
      "ID",
      `${exampleValidClientId} | ["${exampleValidClientId}", "${exampleValidClientId2}"]`,
      async val => {
        return val.length > 0;
      }
    ),
    new RouteParam(
      "Operation",
      "CREATE",
      async val => val == "CREATE" || val == "DELETE" || val == "subscribed"
    )
  ];

  description = `Updates clients according to the specified operation.
    To be called by Client Information System.`;

  exampleResponses = [
    {},
    {
      ...new ClientIdNotFoundException()
    }
  ];

  async apiFunction(params) {
    console.log("UPDATE PARAMS", params);

    const isSubscribing = params.Operation == "subscribed";
    console.log("SUBBING", isSubscribing);

    if (params.Operation == "DELETE") {
      await this.db.removeCard("clientId", params.ID);
    } else if (params.Operation == "CREATE") {
      // create gives single id
      await CardManager.createNewCard(params.ID);
      await CardManager.createNewCard(params.ID, true);
    } else if (isSubscribing) {
      // subscribe gives list of ids
      const existingCards = (await this.db.getAllClients())
        .map(cardId => cardId.clientId)
        .filter((cardId, index, arr) => arr.indexOf(cardId) == index);

      console.log("existing cards", existingCards);
      const cards = params.ID.filter(
        cardId => existingCards.indexOf(cardId) == -1
      );
      console.log("cards", cards);

      for (const id of cards) {
        await CardManager.createNewCard(id);
        await CardManager.createNewCard(id, true);
      }
    }
  }
}
