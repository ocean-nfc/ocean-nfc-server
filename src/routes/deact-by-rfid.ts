import {
  rfidValidator,
  exampleValidClientId,
  exampleValidRfid
} from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import { AuthException, NotAuthorisedException } from "../exceptions";

export class DeactByRfidRoute extends Route {
  getEndpoint() {
    return "/deactivate-by-rfid";
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

  parameters = [new RouteParam("rfid", exampleValidRfid, rfidValidator)];

  description = "Deactivates a clients cards via the card rfid";

  sideEffects = ["Sends a notification alerting that the card was deactivated"];

  protected async apiFunction(params) {
    await this.db.removeCard("rfid", params.rfid);

    return true;
  }
}
