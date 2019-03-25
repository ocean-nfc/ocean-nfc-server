import { cardValidator, rfidValidator, exampleValidRfid, exampleValidCard, isNumber, clientIdValidator } from './../classes/validators';
import { HttpMethod, RouteParam } from './../classes/route';
import { Route } from '../classes/route';

export class AddCardRoute extends Route {
  getEndpoint() { return "/cards/add" }
  getMethod() { return HttpMethod.POST; }

  parameters = [
    new RouteParam('clientId', "1", clientIdValidator),
    new RouteParam('rfid', exampleValidRfid, rfidValidator),
    new RouteParam('cardNumber', exampleValidCard, cardValidator),
    new RouteParam('pin', "12345", async value => isNumber(value) && value.length > 4)
  ];

  protected async apiFunction(params) {
    await this.db.addCard(params.clientId, params.rfid, params.cardNumber, params.pin)

    return {};
  }
}