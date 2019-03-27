import { ClientIdNotFoundException } from './../exceptions';
import { exampleValidCard, exampleValidClientId, exampleValidRfid } from './../classes/validators';
import { RouteTestSuite } from '../classes/route-test-suite';
import { DeactByRfidRoute } from './deact-by-rfid';
import { AddCardRoute } from './add-card';

new RouteTestSuite(new DeactByRfidRoute())
  .testMissingParameters()
  .testInvalidParameters()
  
  // deactivate a card (pass)
  .add({
    name: "Deactivate cards successfully",
    params: {
      rfid: exampleValidRfid
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
        await db.removeCard("rfid",exampleValidRfid);
        var newClient = await db.getClient(exampleValidClientId);
      } catch (e) {
        console.log(e);
      }
      expect(newClient.activated).to.equal(0, "cards successfully deactivated");
    }
  })

  .add({
    name: "Deactivate non-existing card rfid",
    params: {
      rfid: "12121212"
    },
    test: async (res, expect, db) => {
      expect(res.body.message).to.equal(new ClientIdNotFoundException().message);
    }
  })

  .run();