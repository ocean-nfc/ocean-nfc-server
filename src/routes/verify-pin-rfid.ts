import { NotAuthorisedException } from './../exceptions';
import { exampleValidRfid, rfidValidator } from "./../classes/validators";
import { exampleValidPin, pinValidator } from "../classes/validators";
import { HttpMethod, RouteParam } from "../classes/route";
import { Route } from "../classes/route";

export class VerifyPinByRfidRoute extends Route {
  getEndpoint() {
    return "/verify-pin-rfid";
  }

  getMethod() {
    return HttpMethod.POST;
  }

  description = `Verify that a pin is correct for the given card by rfid.
    If the RFID does not exist, returns that the card is invalid.
    If the RFID does exist and the PIN is incorrect, returns not authorised exception with the client ID.
    If the RFID and PIN are correct, returns that the card is valid and the client id.
  `;

  parameters = [
    new RouteParam("rfid", exampleValidRfid, rfidValidator),
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
