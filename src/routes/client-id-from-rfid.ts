import { exampleValidClientId, exampleValidRfid, rfidValidator } from './../classes/validators';
import { HttpMethod, RouteParam } from './../classes/route';
import { Route } from "../classes/route";
import { ClientIdNotFoundException } from '../exceptions';

export class GetClientIdFromRfidNumberRoute extends Route {
  getEndpoint() { return "/client-id-from-rfid-number"; }
  getMethod() { return HttpMethod.GET; }

  parameters = [
    new RouteParam("rfid", exampleValidRfid, rfidValidator)
  ];

  exampleResponse = {
    clientId: exampleValidClientId
  }

  description = "Return client ID from a given rfid";

  async apiFunction(params) {
    const id = await this.db.getClientIdByRfid(params.rfid);
    
    if (id == null) throw new ClientIdNotFoundException();

    return {
      clientId: id
    };
  }
}
