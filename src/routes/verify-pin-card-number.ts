import { NotAuthorisedException } from './../exceptions';
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

  description = `Verify that a pin is correct for the given card by card number.
    If the card number does not exist, returns that the card is invalid.
    If the card number does exist and the PIN is incorrect, returns not authorised exception with the client ID.
    If the card number and PIN are correct, returns that the card is valid and the client id.
  `;

  parameters = [
    new RouteParam("cardNumber", exampleValidCard, cardValidator),
    new RouteParam("pin", exampleValidPin, pinValidator)
  ];

  exampleResponses = [
    { // card doesn't exist
      validCard: false,
      ...new NotAuthorisedException()
    },
    { // card exists, incorrect pin
      validCard: true,
      ...new NotAuthorisedException(),
      clientId: "1"
    },
    { // card exists, correct pin
      validCard: true,
      clientId: "1"
    }
  ];

  async apiFunction() {
    return;
  }
}
