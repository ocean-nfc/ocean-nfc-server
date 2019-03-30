import { ClientIdNotFoundException } from './../exceptions';
import "reflect-metadata";
import { createConnection, Connection, Repository } from "typeorm";
import { ClientCard } from "../models/client-card";
import { config } from "../config";

export class Database {

  private connection: Connection;
  private cardManager: Repository<ClientCard>;

  private static instance: Database = null;
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new Database();
    }
    return this.instance;
  }

  private constructor() {}    
  
  private readyListeners = [];
  private hasInitialised = false;
  private isInitialising = false;
  private ready() : Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.hasInitialised) return resolve();

      this.readyListeners.push(resolve);

      if (this.isInitialising) return;
      this.isInitialising = true;

      console.log("DEVELOPMENT MODE:", config.developmentMode);

      if (config.developmentMode) {
        this.connection = await createConnection({
          type: "sqlite",
          database: "db.sqlite",
          entities: [
            ClientCard
          ],
          synchronize: true,
        });
      }
      else {
        this.connection = await createConnection({
          type: "postgres"
        });
      }

      this.cardManager = this.connection.getRepository(ClientCard);

      while (this.readyListeners.length) {
        this.readyListeners[0]();
        this.readyListeners.shift();
      }

      this.hasInitialised = true;
    });
  }

  /**
   * Adds a card to the database
   * @param clientId 
   * @param rfid 
   * @param cardNumber 
   * @param pin 
   */
  public async addCard(clientId, rfid, cardNumber, pin) {
    await this.ready();
    
    const card = new ClientCard();
    card.clientId = clientId;
    card.rfid = rfid;
    card.cardNumber = cardNumber;
    card.pin = pin;
    card.isActivated = true;

    return await this.cardManager.save(card);
  }

  public async getAllClients(): Promise<ClientCard[]> {
    return await this.cardManager.find();
  }

  public async getClientCards(clientId): Promise<ClientCard[]> {
    await this.ready();

    return await this.cardManager.find({
      clientId
    });
  }

  public async getClientIdFromCardNumber(cardNumber) {
    await this.ready();

    const card = await this.cardManager.findOne({
      cardNumber
    });

    if (card == null) {
      return null;
    }

    return card.clientId;
  }

  public async getClientIdfromRfid(rfid) {
    await this.ready();

    const card = await this.cardManager.findOne({
      rfid
    });

    if (card == null) {
      return null;
    }

    return card.clientId;
  }

  /**
   * Remove a card according to the parameter given
   * @param parameter 
   * @param value 
   */
  public async removeCard(parameter: string, value: string) {
    await this.ready();

    const cards = await this.cardManager.find({
      [parameter]: value
    });

    if (!cards.length) {
      throw new ClientIdNotFoundException({
        [parameter]: value
      });
    }

    for (const card of cards) {
      card.isActivated = false;
      await this.cardManager.save(card);
    }
  }

  public async getByCardNumber(cardNumber) {
    await this.ready();

    return await this.cardManager.findOne({
      cardNumber
    });
  }

  public async getByRfid(rfid) {
    await this.ready();

    return await this.cardManager.findOne({
      rfid
    });
  }

  /**
   * Returns the client id from a card number
   * @param cardNumber 
   */
  public async getClientIdByCardNumber(cardNumber: string) {
    await this.ready();

    const card = await this.cardManager.findOne({
      cardNumber
    });

    if (card == null) {
      return null;
    }

    return card.clientId;
  }

  /**
   * Return the client id from an rfid
   * @param rfid 
   */
  public async getClientIdByRfid(rfid: string) {
    await this.ready();

    const card = await this.cardManager.findOne({
      rfid
    });

    if (card == null) {
      return null;
    }

    return card.clientId;
  /**
   * Return clientId and report success or failure on verification
   * @param rfid 
   * @param pin
   */
  public async verifyPinByRfid(rfid: string, pin: string) {
    await this.ready();

    const card = await this.cardManager.findOne({
      rfid
    });

    if (card == null) {
      return { 
        "validCard": false,
        "message": "NOT_AUTHORISED",
        "code": 401
      };
    }

    if (card.pin == pin)
    {
      return {
        "validCard" : true,
        "clientId" : card.clientId
      };
    }
    else
    {
      return { 
        "validCard": true,
        "message" : "NOT_AUTHORISED",
        "code" : 401,
        "clientId" : card.ClientIdNotFoundException
      };
    }

  }

    /**
   * Return clientId and report success or failure on verification
   * @param rfid 
   * @param pin
   */
  public async verifyPinByCardNumber(cardNumber: string, pin: string) {
    await this.ready();

    const card = await this.cardManager.findOne({
      cardNumber
    });

    if (card == null) {
      return { 
        "validCard": false,
        "message": "NOT_AUTHORISED",
        "code": 401
      };
    }

    if (card.pin == pin)
    {
      return {
        "validCard" : true,
        "clientId" : card.clientId
      };
    }
    else
    {
      return { 
        "validCard": true,
        "message" : ,
        "code" : 401,
        "clientId" : card.ClientIdNotFoundException
      };

  }

  /**
   * Resets the database
   */
  public async reset() {
    await this.ready();

    await this.cardManager.clear();
  }
  
}
