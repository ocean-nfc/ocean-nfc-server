import {
  exampleValidClientId,
  exampleValidRfid,
  exampleValidCard
} from "./validators";
import { Database } from "./database";
import "mocha";
import { expect } from "chai";

const db = Database.getInstance();

describe("Database unit tests", () => {
  it("Should not allow multiple instances", done => {
    const db2 = Database.getInstance();
    expect(db2).to.equal(db);
    done();
  });

  it("Should create a row", done => {
    (async () => {
      const card = await db.addCard(
        exampleValidClientId,
        exampleValidRfid,
        exampleValidCard,
        "12345"
      );
      const foundCards = await db.getAllClients();

      expect(foundCards.length).to.be.gte(1);
      done();
    })();
  });
});
