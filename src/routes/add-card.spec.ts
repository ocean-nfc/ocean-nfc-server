import { exampleValidCard, exampleValidClientId, exampleValidRfid, exampleValidClientId2 } from './../classes/validators';
import { RouteTestSuite } from '../classes/route-test-suite';
import { AddCardRoute } from './add-card';

new RouteTestSuite(new AddCardRoute())
  .testMissingParameters()
  .testInvalidParameters()
  
  // add a card (pass)
  .add({
    name: "Add card",
    params: {
      clientId: exampleValidClientId,
      cardNumber: exampleValidCard,
      rfid: exampleValidRfid,
      pin: "12345"
    },
    test: async (res, expect, db) => {
      expect(res.status).to.equal(200);

      try {
        var cards = await db.getClientCards(exampleValidClientId);
        console.log(cards);
      } catch (e) {
        console.error(e);
      }
      expect(cards.length).to.be.gt(0, "added to server successfully");
    }
  })
 
  // add a different card (pass)
  .add({
    name: "Add card with different client id",
    params: {
      clientId: exampleValidClientId2,
      cardNumber: exampleValidCard,
      rfid: exampleValidRfid,
      pin: "12345"
    },
    test: async (res, expect, db) => {
      expect(res.status).to.equal(200);

      try {
        var cards = await db.getClientCards(exampleValidClientId2);
        console.log(cards);
      } catch (e) {
        console.error(e);
      }
      expect(cards.length).to.be.gt(0, "added to server successfully");
    }
  })  
  .run();