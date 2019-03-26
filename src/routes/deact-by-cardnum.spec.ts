import { ClientAlreadyExistsException } from './../exceptions';
import { exampleValidCard, exampleValidClientId, exampleValidRfid } from './../classes/validators';
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

      let valid = true;
      try {
        const client = await db.getClient(exampleValidClientId);
        console.log(client);
      } catch (e) {
        valid = false;
      }
      expect(valid).to.equal(true, "added to server successfully");
    }
  })
 
  // add the same card (fail)
  .add({
    name: "Add card with same client id",
    params: {
      clientId: exampleValidClientId,
      cardNumber: exampleValidCard,
      rfid: exampleValidRfid,
      pin: "12345"
    },
    test: async (res, expect, db) => {
      expect(res.body.message).to.equal(new ClientAlreadyExistsException().message);
    }
  })
 
  // add a different card (pass)
  .add({
    name: "Add card with different client id",
    params: {
      clientId: "2",
      cardNumber: exampleValidCard,
      rfid: exampleValidRfid,
      pin: "12345"
    },
    test: async (res, expect, db) => {
      expect(res.status).to.equal(200);

      let valid = true;
      try {
        const client = await db.getClient("2");
        console.log(client);
      } catch (e) {
        valid = false;
      }
      expect(valid).to.equal(true, "added to server successfully");
    }
  })  
  .run();