import { exampleValidClientId, exampleValidClientId2 } from './../classes/validators';
import { UpdateClientRoute } from './update-client';
import { RouteTestSuite } from './../classes/route-test-suite';

new RouteTestSuite(new UpdateClientRoute())

  .add({
    name: "Add cards when client is added",
    params: {
      IDS: [exampleValidClientId],
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
      IDS: [exampleValidClientId],
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
      const users = await db.getAllClients();
      expect(users.length).to.equal(6);
    },
  })

  .add({
    name: "Deactivate cards when client is removed 2",
    params: {
      IDS: [exampleValidClientId, exampleValidClientId2],
      Operation: "DELETE"
    },
    test: async (res, expect, db) => {
      const users = await db.getAllClients();
      expect(users.length).to.equal(6);
      expect(users.every(user => user.isActivated == false)).to.equal(true);
    }
  })

  .add({
    name: "Add cards on subscribe, but don't add for existing clients",
    params: {
      IDS: [exampleValidClientId, exampleValidClientId2, "123"],
      Operation: "subscribed"
    },
    test: async (res, expect, db) => {
      const users = await db.getAllClients();
      expect(users.length).to.equal(8);
    },
  })

  .run();