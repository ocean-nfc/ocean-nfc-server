import {
  exampleValidClientId,
  exampleValidRfid,
  exampleValidPin
} from "../classes/validators";
import { GetClientIdFromCardNumberRoute } from "./client-id-from-card-number";
import { RouteTestSuite } from "../classes/route-test-suite";
import { exampleValidCard } from "../classes/validators";

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
    preamble: async db => {
      await db.addCard(
        exampleValidClientId,
        exampleValidRfid,
        exampleValidCard,
        exampleValidPin
      );
    },
    test: async (response, expect) => {
      expect(response.status).to.equal(200);
      expect(response.body.clientId).to.equal(exampleValidClientId);
    }
  })

  .run();
