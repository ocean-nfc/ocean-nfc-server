import { Database } from './database';
import "mocha";
import { expect } from "chai";

const db = Database.getInstance();

describe("Database unit tests", () => {

  it("Should not allow multiple instances", done => {
    const db2 = Database.getInstance();
    expect(db2).to.equal(db);
    done();
  });

  it("Should create a test table", done => {
    (async () => {      
      let didError = false;
      try {
        await db.run("CREATE TABLE testTable (id INT, name TEXT)");
        await db.all("SELECT * FROM testTable");
      } catch (err) {
        console.error(err);
        didError = true;
      }

      expect(didError).to.equal(false);
      done();
    })();
  });

  it("Should insert into the test table", done => {
    (async () => {
      let didError = false;
      try {
        await db.run("INSERT INTO testTable VALUES (1, 'John Doe')");
        const res = await db.all("SELECT * FROM testTable");
        expect(res.length).to.equal(1);
      } catch (err) {
        console.error(err);
        didError = true;
      }

      expect(didError).to.equal(false);
      done();
    })();
  });

  it("should update a row", done => {
    (async () => {
      let didError = false;
      try {
        await db.run("UPDATE testTable SET id=2, name='Jane Doe' WHERE (id = 1)");
        const res = await db.all("SELECT * FROM testTable");
        expect(res[0].id).to.equal(2);
        expect(res[0].name).to.equal("Jane Doe");
      } catch (err) {
        console.error(err);
        didError = true;
      }

      expect(didError).to.equal(false);
      done();
    })();
  });

  it("should delete a row by query", done => {
    (async () => {
      let didError = false;
      try {
        await db.run("INSERT INTO testTable VALUES (1, 'John Doe')");
        await db.run("DELETE FROM testTable WHERE (id=1)");
        const res = await db.all("SELECT * FROM testTable");
        expect(res.length).to.equal(1);
        expect(res[0].id).to.equal(2);
      } catch (err) {
        console.error(err);
        didError = true;
      }

      expect(didError).to.equal(false);
      done();
    })();
  });

  it("should select by query", done => {
    (async () => {
      await db.run("INSERT INTO testTable VALUES (1, 'John Doe')");
      await db.run("INSERT INTO testTable VALUES (3, 'Mary Sue')");
      await db.run("INSERT INTO testTable VALUES (4, 'Don Joe')");

      const allRows = await db.all("SELECT * FROM testTable");
      expect(allRows.length).to.equal(4);
      
      const selectedRows = await db.all("SELECT * FROM testTable WHERE(id > 2)");
      expect(selectedRows.length).to.equal(2);

      done();
    })();
  });

  it("Should delete a test table", done => {
    (async () => {
      let didError = false;
      try {
        await db.run("DROP TABLE testTable");
        await db.all("SELECT * FROM testTable");
      } catch (err) {
        console.error(err);
        didError = true;
      }

      expect(didError).to.equal(true);

      done();
    })();
  });

});