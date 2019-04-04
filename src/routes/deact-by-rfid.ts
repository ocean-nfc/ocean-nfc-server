import {
  rfidValidator,
  exampleValidClientId,
  exampleValidRfid
} from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import { AuthException, NotAuthorisedException } from "../exceptions";
import { Notifications } from "../classes/notifications";

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

    var id = await this.db.getClientIdByRfid(params.rfid);
    var cardNumbers = await this.db.getClientCards(id);
    var cardNumber = cardNumbers[0].cardNumber;

    Notifications.notify(id,"Card Deactivated","Your card referenced by rfid - "+params.rfid + " and card number - " +cardNumber+ " has been deactivated.");
    return true;
  }
}
