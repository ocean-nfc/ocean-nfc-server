import { ClientIdNotFoundException, AuthException } from "./../exceptions";
import {
  exampleValidClientId,
  exampleValidCard,
  exampleValidCard2,
  exampleValidPin
} from "./../classes/validators";
import { RouteTestSuite } from "../classes/route-test-suite";
import { DeactByCardNumRoute } from "./deact-by-cardnum";

new RouteTestSuite(new DeactByCardNumRoute())
  .testMissingParameters()
  .testInvalidParameters()

  // deactivate a card (pass)
  .add({
    name: "Deactivate card successfully",
    params: {
      cardNumber: exampleValidCard
    },
    preamble: async db => {
      await db.addCard(exampleValidClientId, null, exampleValidCard, exampleValidPin);
    },
    test: async (res, expect, db) => {
      console.log("run test");
      expect(res.status).to.equal(200);
      try {
        var card = await db.getByCardNumber(exampleValidCard);
      } catch (e) {
        console.log(e);
      }

      expect(card.isActivated).to.equal(false, "card successfully deactivated");
    }
  })

  .add({
    name: "Deactivate non-existing card",
    params: {
      cardNumber: "4195655241274990"
    },
    test: async (res, expect, db) => {
      expect(res.body).to.equal(
        //new ClientIdNotFoundException().message
        //new AuthException().message
        false
      );
    }
  })

  .run();
