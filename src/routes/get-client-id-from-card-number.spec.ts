import { Database } from './../classes/database';
import { AddCardRoute } from './add-card';
import { exampleValidClientId, exampleValidRfid } from './../classes/validators';
import { GetClientIdFromCardNumberRoute } from './get-client-id-from-card-number';
import { RouteTestSuite } from './../classes/route-test-suite';
import { exampleValidCard } from '../classes/validators';

new RouteTestSuite(new GetClientIdFromCardNumberRoute())
  .testInvalidParameters()
  .testMissingParameters()
  
  .add({
    name: "Get nonexistent card",
    params: {
      cardNumber: exampleValidCard
    },
    test: async (response, expect) => {
      expect(response.status).to.equal(404);
    }
  })

  .add({
    name: "Get existing from card number",
    params: {
      cardNumber: exampleValidCard
    },
    preamble: async () => {
      const res = await RouteTestSuite.request(new AddCardRoute(), {
        clientId: exampleValidClientId,
        cardNumber: exampleValidCard,
        rfid: exampleValidRfid,
        pin: "12345"
      });

      console.log(await Database.getInstance().getAllClients())

      console.log("RES BODY", res.body);
    },
    test: async (response, expect) => {
      expect(response.status).to.equal(200);
      expect(response.body.clientId).to.equal(exampleValidClientId)
    }
  })

  .run();