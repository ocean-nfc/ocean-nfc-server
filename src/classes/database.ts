import { Database as SQLiteDatabase } from "sqlite3";

export class Database {
  private static instance = null;
  public static getInstance(): Database {
    if (Database.instance === null) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private db: SQLiteDatabase;
  private constructor() {}

  private readyListeners = [];
  private hasInitialised = false;
  private isInitialising = false;
  private ready(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.hasInitialised) {
        return resolve();
      }

      this.readyListeners.push(resolve);

      if (this.isInitialising) return; // someone else has already started initialising the database
      this.isInitialising = true;

      this.openDatabase().then(() => {
        while (this.readyListeners.length) {
          this.readyListeners[0](); // resolve the listener
          this.readyListeners.shift(); // remove the listener from the list
        }
        this.hasInitialised = true;
      });
    });
  }

  private openDatabase(): Promise<void> {
    return new Promise(resolve => {
      this.db = new SQLiteDatabase("./db.sqlite", () => {
        this.initialiseMainTable()
          .then(() => this.initialiseLogTable())
          .then(resolve);
      });
    });
  }

  private initialiseMainTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS db (clientId TEXT, rfid TEXT, cardNumber TEXT, pin TEXT)",
        (res, err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  private initialiseLogTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS log (date INT, statusCode INT, method TEXT, url TEXT, parameters TEXT, ip TEXT)",
        (res, err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Runs a query and returns a promise
   * Do NOT use for SELECT
   * @param sqlQuery
   * @param params
   */
  public run(sqlQuery: string, params?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.ready();
      this.db.run(sqlQuery, params, (res, err) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  /**
   * Runs a query and returns a promise containing the resulting rows.
   * Use for SELECT
   * @param sqlQuery
   * @param params
   */
  public all(sqlQuery: string, params?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.ready();
      this.db.all(sqlQuery, params, (res, err) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
}
