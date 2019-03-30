import {
  InvalidParamSuppliedException,
  NotAllParamsSuppliedException
} from "./../exceptions";
import { Route, HttpMethod, RouteParam } from "./route";
import { config } from "../config";
import { Response } from "superagent";

import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import { Database } from "./database";
import { Server } from "../server";
const { expect } = chai;
chai.use(chaiHttp);

let server: Server = null;

/**
 * Runs a set of unit tests for a route. Allows for chaining
 * 
 * Example usage: 
 * new RouteTestSuite(new AddCardRoute())
 *  .testMissingParameters()
 *  .testInvalidParameters()
 *  .run();
 */
export class RouteTestSuite {
  private tests: RouteTest[] = [];

  constructor(private route: Route) {}

  /**
   * Runs the unit tests added to the route
   */
  public run() {
    describe(this.route.getEndpoint(), () => {
      before(done => {
        (async () => {
          server = new Server();
          await server.start();

          await Database.getInstance().reset();
          done();
        })();
      });

      after(done => {
        server.stop().then(done);
      });

      for (const test of this.tests) {
        it(test.name, done => {
          (async () => {
            if (test.preamble) await test.preamble(Database.getInstance());

            const res = await RouteTestSuite.request(this.route, test.params);
            await test.test(res, expect, Database.getInstance());

            done();
          })();
        });
      }
    });
  }

  /**
   * Add a test for this route
   */
  public add(test: RouteTest): RouteTestSuite {
    this.tests.push(test);
    return this;
  }

  /**
   * Tests all combinations of missing parameters for this route
   */
  public testMissingParameters(): RouteTestSuite {
    // generate power set of all route parameters
    // i.e. [a,b,c] => [], [a], [b], [a,b], [c] [a,c], [b,c], [a,b,c]
    const paramCombinanations = (arr => {
      const res = [[]];
      for (const el of arr) {
        const copy = [...res];
        for (const prefix of copy) {
          res.push(prefix.concat(el));
        }
      }
      return res;
    })(this.route.parameters);

    // create a test for each combination
    for (const paramCombination of paramCombinanations) {
      if (paramCombination.length === this.route.parameters.length)
        continue; // we don't want to test if all params are given

      const params = paramCombination.reduce((acc, param: RouteParam) => {
        acc[param.getName()] = param.getExample();
        return acc;
      }, {});

      this.add({
        name: `Supply parameters: ${Object.keys(params).join(', ')}`,
        params,
        test: async (response, expect) => {
          expect(response.body.message).to.equal(new NotAllParamsSuppliedException().message);
        }
      });
    }

    return this;
  }

  /**
   * Tests all parameters with invalid values
   */
  public testInvalidParameters(): RouteTestSuite {
    for (let i = 0; i < this.route.parameters.length; i++) {
      const params = this.route.parameters.reduce((acc, param, index) => {
        acc[param.getName()] = index == i ? "not a valid value" : param.getExample();
        return acc;
      }, {});

      this.add({
        name: `Supply invalid parameter: ${this.route.parameters[i].getName()}`,
        params,
        test: async(response, expect) => {
          expect(response.body.message).to.equal(new InvalidParamSuppliedException().message);
        }
      });
    }
    return this;
  }

  /**
   * Perform an HTTP request and get the response
   * @param route The route which will be called
   * @param params Parameters to supply to the route
   */
  public static async request(route: Route, params: { [param: string]: string }) {
    const req = chai.request(`http://localhost:${config.port}`);
    const url = `${route.getEndpoint()}${this.makeParams(params)}`;
    console.log(url);
    const method = route.getMethod() == HttpMethod.GET ? req.get : req.post;
    try {
      const res = await method
        .call(req, url)
        .send();

      return res;
    } catch (e) {
      console.error(e, route.getEndpoint(), params);
      throw e;
    }
  }

  private static makeParams(params) {
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
}

interface RouteTest {
  name: string;
  params: {[param: string]: string};
  test: (response: Response, expect: Chai.ExpectStatic, db: Database) => Promise<void>;
  preamble?: (db: Database) => Promise<void>;
}
