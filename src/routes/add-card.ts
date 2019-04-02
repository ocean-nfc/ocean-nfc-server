import {
  clientIdValidator,
  exampleValidCard,
  exampleValidPin,
  exampleValidRfid
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
    cardNumbers: [{
      cardNumber: exampleValidCard,
      rfid: exampleValidRfid,
      pin: exampleValidPin
    }]
  };

  protected async apiFunction(params) {
    return [
      await CardManager.createNewCard(params.clientId),
      await CardManager.createNewCard(params.clientId, true),
    ];
  }
}
