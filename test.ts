import { ClientIdNotFoundException } from './src/exceptions';
import { Database } from "./src/classes/database";
import { Server } from "./src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import { config } from "./src/config";

const { expect } = chai;

chai.use(chaiHttp);

let server: Server;
const address = `http://localhost:${config.port}`;

function makeParams(params) {
  return (
    "?" +
    Object.keys(params)
      .reduce((acc, key) => {
        acc.push(`${key}=${params[key]}`);
        return acc;
      }, [])
      .join("&")
  );
}

/**
 * Creates a random row. ClientID is required. Remaining parameteres can be left out or set to underfined
 * to create random values.
 * @param clientId 
 * @param cardNumber 
 * @param rfid 
 * @param pin 
 */
function addRandomCard(clientId, cardNumber = undefined, rfid = undefined, pin = undefined) {
  cardNumber = typeof cardNumber !== "undefined" ? cardNumber : new Array(16).fill(undefined).reduce((acc) => acc + Math.floor(Math.random() * 9), "");
  rfid = typeof rfid !== "undefined" ? rfid : new Array(8).fill(undefined).reduce((acc) => acc + Math.floor(Math.random() * 9), "");
  pin = typeof pin !== "undefined" ? pin : new Array(4).fill(undefined).reduce((acc) => acc + Math.floor(Math.random() * 9), "");

  return chai
  .request(address)
  .post(
    "/add-card" +
      makeParams({
        clientId: clientId,
        cardNumber: cardNumber,
        rfid: rfid,
        pin: pin
      })
  )
  .send();
}


/**
 * server tests
 */
describe("Server tests", () => {
  it("should reset", done => {
    Server.reset().then(done);
  });

  it("should start", done => {
    server = new Server();
    server.start().then(done);
  });

  it("should stop", done => {
    server.stop().then(done);
  });
});


/**
 * /add-card
 */
describe("/add-card", () => {
  before(done => {
    Server.reset()
      .then(() => {
        server = new Server();
        return server.start();
      })
      .then(done);
  });

  after(done => {
    server.stop().then(done);
  });

  describe("Add card with missing parameters", () => {
    it("should error", () => {
      chai
        .request(address)
        .post("/add-card" + makeParams({}))
        .send()
        .then(res => {
          console.log(res.body);
          expect(res.status).to.equal(400, "error status 400");
        });
    });
  });

  describe("Add card with one missing parameter", () => {
    it("should error", () => {
      chai
        .request(address)
        .post(
          "/add-card" +
            makeParams({
              clientId: 1,
              cardNumber: "5555555555555555",
              rfid: "12344321"
              // pin: "12345"
            })
        )
        .send()
        .then(res => {
          console.log(res.body);
          expect(res.status).to.equal(400, "error status 400");
        });
    });
  });

  describe("Add card", () => {
    it("should add card", (done) => {
      chai
        .request(address)
        .post(
          "/add-card" +
            makeParams({
              clientId: 1,
              cardNumber: "5555555555555555",
              rfid: "12344321",
              pin: "12345"
            })
        )
        .send()
        .then(async res => {
          expect(res.status).to.equal(200, "error status 200");
          
          const db = Database.getInstance();
          let valid = true;
          try {
            const client = await db.getClient(1);
            console.log(client);
          } catch (e) {
            valid = false;
          }
          expect(valid).to.equal(true, "added to server successfully");
          done();
        });
    });
  });

  describe("Add card with same id", () => {
    it("should error", (done) => {
      chai
        .request(address)
        .post(
          "/add-card" +
            makeParams({
              clientId: 1,
              cardNumber: "5555555555555555",
              rfid: "12344321",
              pin: "12345"
            })
        )
        .send()
        .then(async res => {
          console.log(res.body);
          expect(res.status).to.equal(400, "error status 400");
          done();
        });
    });
  });

  describe("Add second card with different client id", () => {
    it("should add card", (done) => {
      chai
        .request(address)
        .post(
          "/add-card" +
            makeParams({
              clientId: 2,
              cardNumber: "5555555555555555",
              rfid: "12344321",
              pin: "12345"
            })
        )
        .send()
        .then(async res => {
          expect(res.status).to.equal(200, "error status 200");
          
          const db = Database.getInstance();
          let valid = true;
          try {
            const client = await db.getClient(1);
            console.log(client);
          } catch (e) {
            valid = false;
          }
          expect(valid).to.equal(true, "added to server successfully");
          done();
        });
    });
  });
});

/**
 * /remove-card
 */
describe("/remove-card", () => {
  before(done => {
    Server.reset()
      .then(() => {
        server = new Server();
        return server.start();
      })
      .then(done);
  });

  after(done => {
    server.stop().then(done);
  });

  describe("Don't supply parameters", () => {
    it("should error", (done) => {
      chai
        .request(address)
        .post("/remove-card" + makeParams({}))
        .send()
        .then(res => {
          console.log(res.body);
          expect(res.status).to.equal(400, "error status 400");
          done();
        });
    });
  });

  describe("Remove non-existing card", () => {
    it("should error", (done) => {
      chai
        .request(address)
        .post("/remove-card" + makeParams({
          clientId: 1
        }))
        .send()
        .then(res => {
          console.log(res.body);
          expect(res.status).to.equal(404, "error status 404");
          done();
        });
    })
  });

  describe("Remove existing card", () => {
    it("should remove card", (done) => {
      addRandomCard(1)
        .then(async res => {
          expect(res.status).to.equal(200, "card added status 200"); // card added

          chai
            .request(address)
            .post("/remove-card" + makeParams({
              clientId: 1
            }))
            .send()
            .then(async res => {
              expect(res.status).to.equal(200, "error status 200");

              let rowExists = true;
              try {
                const db = Database.getInstance();
                await db.getClient(1);
              } catch (e) {
                if (e instanceof ClientIdNotFoundException) {
                  rowExists = false;
                }
              }

              expect(rowExists).to.equal(false, "expect row to be deleted");
              done();
            });
        })
      });
  });
});

/**
 * /get-client-id-from-card-number
 */
describe("/get-client-id-from-card-number", () => {
  before(done => {
    Server.reset()
      .then(() => {
        server = new Server();
        return server.start();
      })
      .then(done);
  });

  after(done => {
    server.stop().then(done);
  });

  describe("Don't supply parameters to card number", () => {
    it("should error", (done) => {
      chai
        .request(address)
        .get("/get-client-id-from-card-number" + makeParams({}))
        .then(res => {
          expect(res.status).to.equal(400, "error status 400");
          done();
        });
    });
  });

  describe("Get non existing card", () => {
    it("should error", (done) => {
      chai
        .request(address)
        .get("/get-client-id-from-card-number" + makeParams({
          cardNumber: "5555555555555555"
        }))
        .then(res => {
          expect(res.status).to.equal(404, "error status 404");
          done();
        });
    });
  });

  describe("Get existing from card-number", () => {
    it("should succeed", (done) => {
      addRandomCard("1", "1234123412341234").then(() => {
        chai
          .request(address)
          .get("/get-client-id-from-card-number" + makeParams({
            cardNumber: "1234123412341234"
          }))
          .then(res => {
            expect(res.status).to.equal(200, "error status 200");
            console.log(res.body)
            expect(res.body.clientId).to.equal("1");
            done();
          });
        });
    });
  });

});


/**
 * /get-log
 */
describe("/get-log", () => {
  before(done => {
    Server.reset()
      .then(() => {
        server = new Server();
        return server.start();
      })
      .then(done);
  });

  after(done => {
    server.stop().then(done);
  });

  const time = new Date().getTime(); //used for getting logs
  let numLogs = 0;

	describe("Don't supply parameters", () => {
		it("should error", (done) => {
			chai
				.request(address)
				.get("/get-log")
				.then(res => {
          numLogs++;
					expect(res.status).to.equal(400, "error status 400");
					done();
				});
		});
	});

	describe("Give empty dates", () => {
		it("should error", (done) => {
			chai
				.request(address)
				.get("/get-log" + makeParams({
					startDate: "",
					endDate: ""
				}))
				.then(res => {
          numLogs++;
					expect(res.status).to.equal(400, "error status 400");
					done();
				});
		});
	});

	describe("Give start date > end date", () => {
		it("should error", (done) => {
			chai
				.request(address)
				.get("/get-log" + makeParams({
					startDate: "1552598932",
					endDate: "1552598930"
				}))
				.then(res => {
          numLogs++;
					expect(res.status).to.equal(400, "error status 400");
					done();
				});
		});
	});

	describe("Give correct dates", () => {
		it("should succeed", (done) => {
			chai
				.request(address)
				.get("/get-log" + makeParams({
					startDate: time/1000,
					endDate: (time + 1000)/1000
				}))
				.then(res => {
          numLogs++;
					expect(res.status).to.equal(200, "error status 200");
          console.log(res.body);
          expect(res.body.length).to.equal(numLogs, `${numLogs} logged items`);
					done();
				});
		});
	});

});