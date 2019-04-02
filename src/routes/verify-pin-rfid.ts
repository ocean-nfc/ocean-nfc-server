import { exampleValidRfid, rfidValidator } from "./../classes/validators";
import {
  exampleValidPin,
  pinValidator,
  exampleValidClientId
} from "../classes/validators";
import { HttpMethod, RouteParam } from "../classes/route";
import { Route } from "../classes/route";
import { NotAuthorisedException } from "../exceptions";
import { PinManager } from "../classes/pin";

export class VerifyPinByRfidRoute extends Route {
  getEndpoint() {
    return "/verify-pin-rfid";
  }

  getMethod() {
    return HttpMethod.POST;
  }

  description =
    "Verify that a pin is correct for the given card by card number";

  parameters = [
    new RouteParam("rfid", exampleValidRfid, rfidValidator),
    new RouteParam("pin", exampleValidPin, pinValidator)
  ];

  exampleResponses = [
    {
      // card doesn't exist
      validCard: false,
      ...new NotAuthorisedException(),
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
    const card = await this.db.getByRfid(params.rfid);

    if (card == null || !card.isActivated) {
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
