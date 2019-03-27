import { exampleValidClientId, exampleValidRfid, rfidValidator } from './../classes/validators';
import { HttpMethod, RouteParam } from './../classes/route';
import { Route } from "../classes/route";

export class GetClientIdFromCardNumberRoute extends Route {
  getEndpoint() { return "/client-id-from-card-number"; }
  getMethod() { return HttpMethod.GET; }

  parameters = [
    new RouteParam("rfid", exampleValidRfid, rfidValidator)
  ];

  exampleResponse = {
    clientId: exampleValidClientId
  }

  description = "Return client ID from a given rfid";

  async apiFunction(params) {
    
  }
}
