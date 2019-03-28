import {
  exampleValidCard,
  cardValidator,
  exampleValidPin,
  pinValidator,
  exampleValidClientId
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

  description = "Verify that a pin is correct for the given card number";

  parameters = [
    new RouteParam("cardNumber", exampleValidCard, cardValidator),
    new RouteParam("pin", exampleValidPin, pinValidator)
  ];

  exampleResponse = {
    clientId : exampleValidClientId,
    status: "AUTHENTICATION SUCCESS"
  };

  async apiFunction(params) {
    const res = await this.db.verifyPinByCardNumber(params.cardNumber,params.pin);

    return res;
  }
}
