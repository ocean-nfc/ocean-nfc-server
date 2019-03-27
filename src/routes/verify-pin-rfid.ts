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

  description =
    "Verify that a pin is correct for the given card by card number";

  parameters = [
    new RouteParam("rfid", exampleValidRfid, rfidValidator),
    new RouteParam("pin", exampleValidPin, pinValidator)
  ];

  exampleResponse = {
    valid: false
  };

  async apiFunction() {
    return;
  }
}
