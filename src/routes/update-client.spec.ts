import { exampleValidClientId, exampleValidClientId2 } from './../classes/validators';
import { UpdateClientRoute } from './update-client';
import { RouteTestSuite } from './../classes/route-test-suite';

new RouteTestSuite(new UpdateClientRoute())

  .add({
    name: "Add card when client is added",
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
    name: "Deactivate card when client is removed",
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
    name: "Add card when client is added 2",
    params: {
      ID: exampleValidClientId2,
      Operation: "CREATE"
    },
    test: async (res, expect, db) => {
      const users = await db.getAllClients();
      expect(users.length).to.equal(4);
    },
  })

  .add({
    name: "Deactivate card when client is removed 2",
    params: {
      ID: exampleValidClientId2,
      Operation: "DELETE"
    },
    test: async (res, expect, db) => {
      const users = await db.getAllClients();
      expect(users.length).to.equal(4);
      expect(users.every(user => user.isActivated == false)).to.equal(true);
    }
  })

  .add({
    name: "Add cards on subscribe, but don't add for existing clients",
    params: {
      ID: [exampleValidClientId + "1", exampleValidClientId2 + "2", "123"],
      Operation: "subscribed"
    },
    test: async (res, expect, db) => {
      const users = await db.getAllClients();
      expect(users.length).to.equal(6);
    },
  })

  .run();