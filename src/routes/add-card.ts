import {
  clientIdValidator,
  exampleValidCard,
  exampleValidCard2
} from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import { CardManager } from "../classes/card";

export class AddCardRoute extends Route {
  getEndpoint() {
    return "/add-card";
  }
  getMethod() {
    return HttpMethod.POST;
  }

  parameters = [new RouteParam("clientId", "1", clientIdValidator)];

  description = "Assigns a new random card to a client";

  sideEffects = [
    "Sends a notification containing the generated PIN",
    "Sends a notification containing the generated card number/rfid"
  ];

  exampleResponse = {
    cardNumbers: [exampleValidCard, exampleValidCard2]
  };

  protected async apiFunction(params) {
    
    const cardNumbers = [];

    for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
      cardNumbers.push(await CardManager.createNewCard(params.clientId, true));
    }

    return {
      cardNumbers
    };
  }
}
