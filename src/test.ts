import { ClientIdNotFoundException } from './src/exceptions';
import { Database } from "./src/classes/database";
import { Server } from "./src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import { config } from "./src/config";
import { verifyPin } from "./src/routes/verify-pin.ts"
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
 * /verify-pin
 */
describe("/verify-pin", () => {
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
        .post("/verify-pin")
        .send()
				.then(res => {
          console.log(res.body);
					expect(res.status).to.equal(400, "error status 400");
					done();
				});
		});
  });

  describe("Check pin for non-existing user", () => {
		it("should error", (done) => {
			chai
				.request(address)
        .post("/verify-pin" + makeParams({
          cardNumber: 1,
          pin: "12345"
        }))
        .send()
				.then(res => {
          console.log(res.body);
					expect(res.status).to.equal(404, "error status 404");
					done();
				});
		});
  });

  describe("Check pin for existing user", () => {
		it("should succeed", (done) => {

      addRandomCard(1, undefined, undefined, "12345").then(() => {
        chai
          .request(address)
          .post("/verify-pin" + makeParams({
            clientId: 1,
            pin: "12345"
          }))
          .send()
          .then(res => {
            console.log(res.body);
            expect(res.status).to.equal(200, "error status 200");
            expect(res.body.valid).to.equal(true);
            done();
          });
        });
		});
  });

  describe("Check invalid pin for existing user", () => {
		it("should succeed, but return invalid", (done) => {
			chai
				.request(address)
        .post("/verify-pin" + makeParams({
          clientId: 1,
          pin: "123456"
        }))
        .send()
				.then(res => {
          console.log(res.body);
          expect(res.status).to.equal(200, "error status 200");
          expect(res.body.valid).to.equal(false);
					done();
				});
		});
  });
});