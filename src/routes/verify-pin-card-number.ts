import {
  exampleValidCard,
  cardValidator,
  exampleValidPin,
  pinValidator
} from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";

export class VerifyPinByCardNumberRoute extends Route {
  getEndpoint() {
    return "/verify-pin-card-number";
  }

  getMethod() {
    return HttpMethod.POST;
  }

  description = "Verify that a pin is correct for the given card by rfid";

  parameters = [
    new RouteParam("cardNumber", exampleValidCard, cardValidator),
    new RouteParam("pin", exampleValidPin, pinValidator)
  ];

  exampleResponse = {
    valid: false
  };

  async apiFunction() {
    return;
  }
}
