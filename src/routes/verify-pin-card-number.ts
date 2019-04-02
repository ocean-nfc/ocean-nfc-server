import {
  exampleValidCard,
  cardValidator,
  exampleValidPin,
  pinValidator
} from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import { NotAuthorisedException } from "../exceptions";
import { PinManager } from "../classes/pin";

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
    {
      // card doesn't exist
      validCard: false,
      ...new NotAuthorisedException()
    },
    {
      // card exists, incorrect pin
      validCard: true,
      ...new NotAuthorisedException(),
      clientId: "1"
    },
    {
      // card exists, correct pin
      validCard: true,
      clientId: "1"
    }
  ];

  async apiFunction(params) {
    const card = await this.db.getByCardNumber(params.cardNumber);

    if (card == null) {
      return {
        validCard: false,
        ...new NotAuthorisedException()
      };
    }

    if (await PinManager.verifyPinHash(params.pin, card.pin)) {
      return {
        validCard: true,
        clientId: card.clientId
      };
    }

    return {
      validCard: true,
      ...new NotAuthorisedException(),
      clientId: card.clientId
    };
  }
}
