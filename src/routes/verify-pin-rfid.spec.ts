import { NotAuthorisedException } from "./../exceptions";
import {
  exampleValidRfid,
  exampleValidPin,
  exampleValidClientId,
  exampleValidCard
} from "./../classes/validators";
import { VerifyPinByRfidRoute } from "./verify-pin-rfid";
import { RouteTestSuite } from "./../classes/route-test-suite";
import { PinManager } from "../classes/pin";

new RouteTestSuite(new VerifyPinByRfidRoute())
  .testInvalidParameters()
  .testMissingParameters()

  .add({
    name: "Fail to find missing rfid",
    params: {
      rfid: exampleValidRfid,
      pin: exampleValidPin
    },
    test: async (res, expect, db) => {
      expect(res.body.message).to.equal(new NotAuthorisedException().message);
      expect(res.body.validCard).to.equal(false);
    }
  })

  .add({
    name: "Provide incorrect pin",
    params: {
      rfid: exampleValidRfid,
      pin: "99999"
    },
    preamble: async db => {
      await db.addCard(
        exampleValidClientId,
        exampleValidRfid,
        exampleValidCard,
        await PinManager.generatePinHash(exampleValidPin)
      );
    },
    test: async (res, expect, db) => {
      expect(res.body.message).to.equal(new NotAuthorisedException().message);
      expect(res.body.clientId).to.equal(exampleValidClientId);
      expect(res.body.validCard).to.equal(true);
    }
  })

  .add({
    name: "Provide correct pin",
    params: {
      rfid: exampleValidRfid,
      pin: exampleValidPin
    },
    test: async (res, expect, db) => {
      expect(res.body.clientId).to.equal(exampleValidClientId);
      expect(res.body.validCard).to.equal(true);
    }
  })

  .run();
