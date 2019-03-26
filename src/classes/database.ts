import { ClientAlreadyExistsException } from "./../exceptions";
import { Database as SQLiteDatabase } from "sqlite3";
import { ClientIdNotFoundException } from "../exceptions";
import * as fs from "fs";

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
        "CREATE TABLE IF NOT EXISTS db (clientId TEXT, rfid TEXT, cardNumber TEXT, pin TEXT, activated INTEGER)",
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
  public run(sqlQuery: string, params?: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      await this.ready();
      this.db.run(sqlQuery, params, err => {
        if (err) console.log(err);
        if (err) reject(err);
        else resolve();
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
    return new Promise<any>(async (resolve, reject) => {
      await this.ready();
      this.db.all(sqlQuery, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  /**
   * Adds an item to the log
   * @param date 
   * @param statusCode 
   * @param method 
   * @param url 
   * @param query 
   * @param ip 
   */
  public addLogItem(date, statusCode, method, url, query: string, ip): Promise<void> {
    return this.run("INSERT INTO log VALUES (?, ?, ?, ?, ?, ?)", [
      date,
      statusCode,
      method,
      url,
      query,
      ip
    ]);
  }
  /**
   * Returns a list of log items between the start and end dates
   * @param startDate 
   * @param endDate 
   */
  public getLogForDates(startDate, endDate) {
    return this.all("SELECT * FROM log WHERE (date >= ? AND date <= ?)", [
      startDate,
      endDate
    ]);
  }

  /**
   * Adds a card to the database
   * Throws exception if the client already exists in the database
   * @param clientId 
   * @param rfid 
   * @param cardNumber 
   * @param pin 
   */
  public async addCard(clientId, rfid, cardNumber, pin) {
    try {
      await this.getClient(clientId);
    } catch (e) {
      if (e instanceof ClientIdNotFoundException) {
        // client doesn't exist - good
        await this.run(`INSERT INTO db VALUES (?, ?, ? ,?)`, [
          clientId,
          rfid,
          cardNumber,
          pin
        ]);
        return;
      } else {
        throw e;
      }
    }

    throw new ClientAlreadyExistsException();
  }

  /**
   * Removes a card from the database.
   * Throws exception if client doesn't exist
   * @param clientId 
   */
  public async removeCard(clientId) {
    // ensure client exists
    await this.getClient(clientId);
    await this.run("DELETE FROM db WHERE (clientId=?)", [clientId]);
  }

  /**
   * Returns a list of all clients
   */
  public getAllClients() {
    return this.all("SELECT * FROM db");
  }

  private async getAllClientsByProperty(propertyName, propertyValue) {
    const users = await this.all(`SELECT * FROM db WHERE (${propertyName}=?)`, [
      propertyValue
    ]);
    if (users.length === 0) {
      throw new ClientIdNotFoundException();
    }
    return users;
  }

  private async getClientByProperty(propertyName, propertyValue) {
    return (await this.getAllClientsByProperty(propertyName, propertyValue))[0];
  }

  private async getClientIdByProperty(propertyName, propertyValue) {
    return (await this.getClientByProperty(propertyName, propertyValue))
      .clientId;
  }

  /**
   * Returns a client ID for matching card number.
   * Throws ClientIdNotFoundException
   * @param cardNumber 
   */
  public getClientIdByCardNumber(cardNumber) {
    return this.getClientIdByProperty("cardNumber", cardNumber);
  }

  /**
   * Returns a client ID for matching RFID
   * Throws ClientIdNotFoundException
   * @param rfid 
   */
  public getClientIdByRfid(rfid) {
    return this.getClientIdByProperty("rfid", rfid);
  }

  /**
   * Returns a client object for the given id
   * Throws ClientIdNotFoundException
   * @param clientId 
   */
  public getClient(clientId) {
    return this.getClientByProperty("clientId", clientId);
  }

  /**
   * Update a specified property of a client
   * Throws ClientIdNotFoundException
   * @param clientId 
   * @param propertyName 
   * @param propertyValue 
   */
  public async updateClient(clientId, propertyName, propertyValue) {
    // test that the client exists
    await this.getClient(clientId);
    return await this.run(
      `UPDATE db SET ${propertyName}=? WHERE (clientId=?)`,
      [propertyValue, clientId]
    );
  }

  /**
   * Update client rfid for specified client
   * Throws ClientIdNotFoundException
   * @param clientId 
   * @param rfid 
   */
  public updateClientRfid(clientId, rfid) {
    return this.updateClient(clientId, "rfid", rfid);
  }
  /**
   * Update client pin for specified client
   * Throws ClientIdNotFoundException
   * @param clientId 
   * @param pin 
   */
  public updateClientPin(clientId, pin) {
    return this.updateClient(clientId, "pin", pin);
  }
  /**
   * Update client card number for specified client id
   * Throws ClientIdNotFoundException
   * @param clientId 
   * @param cardNumber 
   */
  public updateClientCardNumber(clientId, cardNumber) {
    return this.updateClient(clientId, "cardNumber", cardNumber);
  }

  public async reset() {
    await this.ready();
    await this.db.run("DELETE FROM db WHERE 1");
    await this.db.run("DELETE FROM log WHERE 1");
  }
}
