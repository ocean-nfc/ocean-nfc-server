import { NotAuthorisedException } from './../exceptions';
import { ClientIdNotFoundException } from "../exceptions";
import {
  exampleValidCard,
  cardValidator,
  exampleValidClientId
} from "../classes/validators";
import { HttpMethod, RouteParam } from "../classes/route";
import { Route } from "../classes/route";

export class GetClientIdFromCardNumberRoute extends Route {
  getEndpoint() {
    return "/client-id-from-card-number";
  }
  getMethod() {
    return HttpMethod.GET;
  }

  parameters = [new RouteParam("cardNumber", exampleValidCard, cardValidator)];

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

  description = `Return client ID from a given card number.
    If the card number is incorrect, returns an unauthorised exception
    `;


  async apiFunction(params) {
    const id = await this.db.getClientIdByCardNumber(params.cardNumber);

    if (id == null) throw new ClientIdNotFoundException();

    return {
      clientId: id
    };
  }
}
