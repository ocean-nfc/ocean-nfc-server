import { cardValidator, rfidValidator, exampleValidRfid, exampleValidCard, isNumber, clientIdValidator } from './../classes/validators';
import { HttpMethod, RouteParam } from './../classes/route';
import { Route } from '../classes/route';
import { Card } from '../classes/card';

export class AddCardRoute extends Route {
  getEndpoint() { return "/cards/add" }
  getMethod() { return HttpMethod.POST; }

  parameters = [
    new RouteParam('clientId', "1", clientIdValidator),
  ];

  description = "Assigns a new random card to a client";

  sideEffects = [
    "Sends a notification containing the generated PIN",
    "Sends a notification containing the generated card number/rfid"
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