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
