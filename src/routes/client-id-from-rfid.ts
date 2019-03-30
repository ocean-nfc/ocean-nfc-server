import {
  exampleValidClientId,
  exampleValidRfid,
  rfidValidator
} from "./../classes/validators";
import { HttpMethod, RouteParam } from "./../classes/route";
import { Route } from "../classes/route";
import {
  ClientIdNotFoundException,
  NotAuthorisedException
} from "../exceptions";

export class GetClientIdFromRfidNumberRoute extends Route {
  getEndpoint() {
    return "/client-id-from-rfid-number";
  }
  getMethod() {
    return HttpMethod.GET;
  }

  parameters = [new RouteParam("rfid", exampleValidRfid, rfidValidator)];

  exampleResponses = [
    {
      // card exists, return client id
      clientId: exampleValidClientId
    },
    {
      // when card doesn't exist:
      ...new NotAuthorisedException()
    }
  ];

  description = `Return client ID from a given rfid.
    If the rfid is incorrect, returns an unauthorised exception
    `;

  async apiFunction(params) {
    const id = await this.db.getClientIdByRfid(params.rfid);

    if (id == null) throw new ClientIdNotFoundException();

    return {
      clientId: id
    };
  }
}
