import { exampleValidClientId } from './../classes/validators';
import { UpdateClientRoute } from './update-client';
import { RouteTestSuite } from './../classes/route-test-suite';

new RouteTestSuite(new UpdateClientRoute())

  .add({
    name: "Add cards when client is added",
    params: {
      ID: exampleValidClientId,
      Operation: "CREATE"
    },
    test: async (res, expect, db) => {
      const users = await db.getClientCards(exampleValidClientId);
      expect(users.length).to.equal(2);
    },
  })

  .add({
    name: "Deactivate cards when client is removed",
    params: {
      ID: exampleValidClientId,
      Operation: "DELETE"
    },
    test: async (res, expect, db) => {
      const users = await db.getClientCards(exampleValidClientId);
      expect(users.length).to.equal(2);
      expect(users.every(user => user.isActivated == false)).to.equal(true);
    }
  })

  .add({
    name: "Add cards when client is added 2",
    params: {
      IDS: [exampleValidClientId, exampleValidClientId2],
      Operation: "CREATE"
    },
    test: async (res, expect, db) => {
      const users = await db.getClientCards(exampleValidClientId);
      expect(users.length).to.equal(4);
    },
  })

  .add({
    name: "Deactivate cards when client is removed 2",
    params: {
      IDS: [exampleValidClientId, exampleValidClientId2],
      Operation: "DELETE"
    },
    test: async (res, expect, db) => {
      const users = await db.getClientCards(exampleValidClientId);
      expect(users.length).to.equal(4);
      expect(users.every(user => user.isActivated == false)).to.equal(true);
    }
  })

  .run();