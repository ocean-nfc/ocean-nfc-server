import { exampleValidRfid, rfidValidator } from "./../classes/validators";
import { exampleValidPin, pinValidator,exampleValidClientId } from "../classes/validators";
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

  exampleResponses = [
    { // card doesn't exist
      validCard: false,
      ...new NotAuthorisedException(),
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

    const res = await this.db.verifyPinByRfid(params.rfid,params.pin);

    return res;
  }
}
