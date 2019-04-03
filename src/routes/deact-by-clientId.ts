import {
  clientIdValidator,
  exampleValidClientId
} from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import { AuthException, NotAuthorisedException } from "../exceptions";

export class DeactByClientIdRoute extends Route {
  getEndpoint() {
    return "/deactivate-by-clientId";
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

  parameters = [
    new RouteParam("clientId", exampleValidClientId, clientIdValidator)
  ];

  description = "Deactivates a clients cards via the clients ID";

  sideEffects = ["Sends a notification alerting that the card was deactivated"];

  protected async apiFunction(params) {
    await this.db.removeCard("clientId", params.clientId);

    return true;
  }
}
