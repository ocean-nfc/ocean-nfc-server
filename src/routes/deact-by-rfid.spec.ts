import { ClientIdNotFoundException } from "./../exceptions";
import {
  exampleValidCard,
  exampleValidClientId,
  exampleValidRfid,
  exampleValidPin
} from "./../classes/validators";
import { RouteTestSuite } from "../classes/route-test-suite";
import { DeactByRfidRoute } from "./deact-by-rfid";
import { AddCardRoute } from "./add-card";

new RouteTestSuite(new DeactByRfidRoute())
  .testMissingParameters()
  .testInvalidParameters()

  // deactivate a card (pass)
  .add({
    name: "Deactivate cards successfully",
    params: {
      rfid: exampleValidRfid
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
        await db.removeCard("rfid", exampleValidRfid);
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
    name: "Deactivate non-existing card rfid",
    params: {
      rfid: "12121212"
    },
    test: async (res, expect, db) => {
      expect(res.body.message).to.equal(
        new ClientIdNotFoundException().message
      );
    }
  })

  .run();
