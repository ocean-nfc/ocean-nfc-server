import { cardValidator, rfidValidator } from './../classes/validators';
import { ApiEndpoint, HttpMethod, RouteParam } from './../classes/route';
import { Route } from '../classes/route';

export class AddCardRoute extends Route {
  getEndpoint() { return ApiEndpoint.ADD_CARD; }
  getMethod() { return HttpMethod.POST; }

  parameters = [
    new RouteParam('clientId', async value => /^\d+$/.test(value)),
    new RouteParam('rfid', rfidValidator),
    new RouteParam('cardNumber', cardValidator),
    new RouteParam('pin', async value => value.length > 4)
  ];

  protected async apiFunction(params) {
    await this.db.addCard(params.clientId, params.rfid, params.cardId, params.pin)

    return {};
  }
}