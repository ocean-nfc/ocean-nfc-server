import { ClientIdNotFoundException } from "./../exceptions";
import {
  exampleValidCard,
  exampleValidClientId,
  exampleValidRfid,
  exampleValidPin
} from "./../classes/validators";
import { RouteTestSuite } from "../classes/route-test-suite";
import { DeactByClientIdRoute } from "./deact-by-clientId";
import { AddCardRoute } from "./add-card";

new RouteTestSuite(new DeactByClientIdRoute())
  .testMissingParameters()
  .testInvalidParameters()

  // deactivate a card (pass)
  .add({
    name: "Deactivate cards successfully",
    params: {
      clientId: exampleValidClientId
    },
    preamble: async db => {
      await db.addCard(
        exampleValidClientId,
        exampleValidRfid,
        exampleValidCard,
        exampleValidPin
      );
    },
    test: async (res, expect, db) => {
      expect(res.status).to.equal(200);
      try {
        var cards = await db.getClientCards(exampleValidClientId);
      } catch (e) {
        console.log(e);
      }

      for (const card of cards) {
        expect(card.isActivated).to.equal(
          false,
          "cards successfully deactivated"
        );
      }
    }
  })

  .add({
    name: "Deactivate non-existing clients card",
    params: {
      clientId: "100"
    },
    test: async (res, expect, db) => {
      expect(res.body.message).to.equal(
        new ClientIdNotFoundException().message
      );
    }
  })

  .run();
