import { ClientAlreadyExistsException, ClientIdNotFoundException } from './../exceptions';
import { exampleValidCard, exampleValidClientId, exampleValidRfid } from './../classes/validators';
import { RouteTestSuite } from '../classes/route-test-suite';
import { DeactByCardNumRoute } from './deact-by-cardnum';
import { AddCardRoute } from './add-card';

new RouteTestSuite(new DeactByCardNumRoute())
  .testMissingParameters()
  .testInvalidParameters()
  
  // deactivate a card (pass)
  .add({
    name: "Deactivate card successfully",
    params: {
      cardNumber: exampleValidCard
    },preamble: async () => {
      await RouteTestSuite.request(new AddCardRoute(),{
        clientId: exampleValidClientId,
        cardNumber: exampleValidCard,
        rfid: exampleValidRfid,
        pin: "12345"
      })
    },
    test: async (res, expect, db) => {
      expect(res.status).to.equal(200);
      try {
        await db.removeCard("cardNumber",exampleValidCard);
        var newClient = await db.getClient(exampleValidClientId);
      } catch (e) {
        console.log(e);
      }
      expect(newClient.activated).to.equal(0, "card successfully deactivated");
    }
  })

  .add({
    name: "Deactivate non-existing card",
    params: {
      cardNumber: "1234567890123456"
    },
    test: async (res, expect, db) => {
      expect(res.body.message).to.equal(new ClientIdNotFoundException().message);
    }
  })

  .run();