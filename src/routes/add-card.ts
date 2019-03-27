import { cardValidator, rfidValidator, exampleValidRfid, exampleValidCard, isNumber, clientIdValidator } from './../classes/validators';
import { HttpMethod, RouteParam } from './../classes/route';
import { Route } from '../classes/route';
import { Card } from '../classes/card';

export class AddCardRoute extends Route {
  getEndpoint() { return "/cards/add" }
  getMethod() { return HttpMethod.POST; }

  parameters = [
    new RouteParam('clientId', "1", clientIdValidator),
    //new RouteParam('rfid', exampleValidRfid, rfidValidator),
    //new RouteParam('cardNumber', exampleValidCard, cardValidator),
    //new RouteParam('pin', "12345", async value => isNumber(value) && value.length > 4)
  ];

  protected async apiFunction(params) {
    //await this.db.addCard(params.clientId, params.rfid, params.cardId, params.pin)
    let c = new Card();
    let cardnumber = await c.createNewCard(params.clientId, true);
    //call pin generation with card number
    if(Boolean(Math.round(Math.random()))){
      let cardnumber2 = await c.createNewCard(params.clientId, true);
      //call pin generation with card number
      return {
        "cardnumber": cardnumber,
        "secondcardnumber": cardnumber2,
      };  
    }
    return {
      "cardnumber": cardnumber,
    };
  }
}