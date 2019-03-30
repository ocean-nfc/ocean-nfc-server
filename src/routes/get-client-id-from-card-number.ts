import { exampleValidCard, cardValidator, exampleValidClientId } from './../classes/validators';
import { HttpMethod, RouteParam } from './../classes/route';
import { Route } from "../classes/route";

export class GetClientIdFromCardNumberRoute extends Route {
  getEndpoint() { return "/client-id/from/card-number"; }
  getMethod() { return HttpMethod.GET; }

  parameters = [
    new RouteParam("cardNumber", exampleValidCard, cardValidator)
  ];

  exampleResponse = {
    clientId: exampleValidClientId
  }

  description = "Return client ID from a given card number";

  async apiFunction(params) {
    try {
      const id = await this.db.getClientIdByCardNumber(params.cardNumber);
      return {
        clientId: id
      };
    } catch (e) {
      throw e;
    }
  }
}
