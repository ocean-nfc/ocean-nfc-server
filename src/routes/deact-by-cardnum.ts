import { cardValidator, exampleValidCard } from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import { AuthException, NotAuthorisedException } from "../exceptions";
import { Notifications } from "../classes/notifications";
import { Log } from "../classes/log";
import { GetClientIdFromCardNumberRoute } from "./client-id-from-card-number";

export class DeactByCardNumRoute extends Route {
  getEndpoint() {
    return "/deactivate-by-card-number";
  }
  getMethod() {
    return HttpMethod.POST;
  }

  exampleResponses = [
    {
      success : "{}"
    },
    {
      ...new NotAuthorisedException()
    }
  ];
  parameters = [new RouteParam("cardNumber", exampleValidCard, cardValidator)];

  description = "Deactivates a clients card via receiving its card number";

  sideEffects = ["Sends a notification alerting that the card was deactivated"];

  protected async apiFunction(params) {
    await this.db.removeCard("cardNumber", params.cardNumber);

    var id = await this.db.getClientIdByCardNumber(params.cardNumber);
    
    Notifications.notify(id,"Card Deactivated","Your card referenced via card number "+params.cardNumber + " has been deactivated.");

    return {};
  }
}
