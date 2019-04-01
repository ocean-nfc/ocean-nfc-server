import {
  exampleValidCard,
  cardValidator,
  exampleValidPin,
  pinValidator
} from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import { NotAuthorisedException } from "../exceptions";

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

  exampleResponses = [
    { // card doesn't exist
      validCard: false,
      ...new NotAuthorisedException() ,
      code: 401
    },
    { // card exists, incorrect pin
      validCard: true,
      ...new NotAuthorisedException(),
      code: 401,
      clientId: "1"
    },
    { // card exists, correct pin
      validCard: true,
      clientId: "1"
    }
  ];

  async apiFunction(params) {
    const res = await this.db.verifyPinByCardNumber(params.cardNumber,params.pin);

    return res;
  }
}
