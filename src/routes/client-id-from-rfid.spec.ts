import {
    exampleValidClientId,
    exampleValidRfid,
    exampleValidPin
  } from "./../classes/validators";
  import { GetClientIdFromRfidNumberRoute } from "./client-id-from-rfid";
  import { RouteTestSuite } from "./../classes/route-test-suite";
  import { exampleValidCard } from "../classes/validators";
  
  new RouteTestSuite(new GetClientIdFromRfidNumberRoute())
    .testInvalidParameters()
    .testMissingParameters()
  
    .add({
      name: "Get client using nonexistent rfid number",
      params: {
        rfid: exampleValidRfid
      },
      test: async (response, expect) => {
        expect(response.status).to.equal(404);
      }
    })
  
    .add({
      name: "Get client using existing rfid number",
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
      test: async (response, expect) => {
        expect(response.status).to.equal(200);
        expect(response.body.clientId).to.equal(exampleValidClientId);
      }
    })
  
    .run();
  