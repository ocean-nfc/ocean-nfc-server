import { cardValidator, exampleValidCard } from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import { AuthException, NotAuthorisedException } from "../exceptions";

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

    return {};
  }
}
