import { Database } from "./../classes/database";
import { PinManager } from "./pin";
import { Notifications } from "./notifications";

const db = Database.getInstance();

/**
 * This class is used to create, read, update and deactivate client's bank cards.
 */
export class CardManager {

  /**
   * Array of valid FNB Credit Card BINs
   *
   * @type string
   */
  private static readonly FnbCreditCardBins: string[] = [
    "419565",
    "419566",
    "419567"
  ];

  /**
   * Array of valid FNB Debit Card BINs
   *
   * @type string
   */
  private static readonly FnbDebitCardBins: string[] = [
    "419570"
  ];

  /**
   * Generates a new bank card and save it to the database with the client's ID.
   *
   * @param clientID - Who's card it is
   * @param credit - Credit card or not
   * @returns The new card number
   */
  public static async createNewCard(clientID: string, generateRfid = false): Promise<{
    cardNumber: string,
    rfid: string,
    pin: string
  }> {
    let number = await this.generateNewCard(Boolean(Math.round(Math.random())));
    let rfid = generateRfid ? await this.generateRfIDNumber() : null;

    const { pin, hash } = await PinManager.createNewPin();

    let message = "Your new card has just been created!<br><br>";
    message += "Card Number: " + number + "<br>";
    if (rfid) {
      message += "RfID Number: " + rfid + "<br>";
    }
    message += "Pin Number: " + pin + "<br>";

    let success = await Notifications.notify(clientID, "New Bank Card", message);
    if (success) {
      await db.addCard(clientID, rfid, number, hash);
      return {
        cardNumber: number,
        rfid: rfid,
        pin: pin
      };
    } else {
      return null;
    }    
  }

  /**
   * Deactivates a bank card by using the card's number and then notifies the client.
   * 
   * @param number - The number of the card
   * @returns Whether or not it was deactivated
   */
  public static async deactivateCardByNumber(number: string): Promise<boolean> {
    let card = await db.getByCardNumber(number);
    if (!card) {
      return false;
    }
    
    let message = "One of your cards have been deactivated.<br><br>";
    message += "Card Number: " + card.cardNumber + "<br>";
    if (card.rfid) {
      message += "RfID Number: " + card.rfid + "<br>";
    }

    let success = await Notifications.notify(card.clientId, "Card Deactivation", message);
    if (success) {
      await db.removeCard("cardNumber", number);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Deactivates a bank card by using the card's rfid number and then notifies the client.
   * 
   * @param number - The number of the card
   * @returns Whether or not it was deactivated
   */
  public static async deactivateCardByRfID(rfid: string): Promise<boolean> {
    let card = await db.getByRfid(rfid);
    if (!card) {
      return false;
    }
    
    let message = "One of your cards have been deactivated.<br><br>";
    message += "Card Number: " + card.cardNumber + "<br>";
    message += "RfID Number: " + card.rfid + "<br>";

    let success = await Notifications.notify(card.clientId, "Card Deactivation", message);
    if (success) {
      await db.removeCard("rfid", rfid);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Deactivates all of a client's bank cards and then notifies them.
   * 
   * @param clientID - The client who's cards need to be deactivated
   * @returns Whether or not it was deactivated
   */
  public static async deactivateAllCards(clientID: string): Promise<boolean> {
    let cards = await db.getClientCards(clientID);

    let message = "All of your cards have been deactivated.<br><br>";
    cards.forEach(card => {
      if(card.isActivated){
        message += "Card Number: " + card.cardNumber + "<br>";
        if (card.rfid) {
          message += "RfID Number: " + card.rfid + "<br>";
        }
        message += "<br>";
      }
    });

    let success = await Notifications.notify(clientID, "Card Deactivation", message);
    if (success) {
      await db.removeCard("clientId", clientID);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks whether or not the bank card is valid by performing a selection of tests.
   *
   * @param number - The bank card number to check
   * @returns Whether or not it's valid
   */
  public static isCardNumberValid(number: string): boolean {
    if (number.length != 16) {
      return false;
    }
    if (!this.isCheckDigitValid(number)) {
      return false;
    }
    if (!this.isFNBCardNumber(number)) {
      return false;
    }
    return true;
  }

  /**
   * Checks whether or not the bank card's rfid number is valid by performing a selection of tests.
   * 
   * @param rfid - The bank card's rfid number to check
   * @returns Whether or not it's valid
   */
  public static isRfidNumberValid(rfid: string): boolean {
    if (rfid.length != 8) {
      return false;
    }
    /*if (!isNumber(rfid)) {
      return false;
    }*/
    return true;
  }

  /**
   * Generates and returns the checkdigit/checksum for the card number.
   *
   * @param number - The card number that is used to generate a checkdigit/checksum
   * @returns The number's checkdigit/checksum
   */
  private static generateCheckDigit(number: string): number {
    let total = 0;
    let parity = 2;
    for (let i = number.length - 1; i >= 0; i--) {
      let single = Math.max(parity, 1) * parseInt(number[i]);
      if (single > 9) {
        let temp = single
          .toString()
          .split("")
          .map(Number);
        total += temp.reduce(function(a, b) {
          return a + b;
        }, 0);
      } else {
        total += single;
      }
      parity *= -1;
    }
    total %= 10;
    if (total > 0) {
      return 10 - total;
    } else {
      return 0;
    }
  }

  /**
   * Returns a valid FNB BIN (Bank Identification Number) for a credit or debit card.
   *
   * @param credit - Specifies whether the card is a credit or debit card
   * @returns The BIN for the card
   */
  private static getBinNumber(credit: boolean): string {
    let min: number;
    let max: number;
    let random: number;
    if (credit) {
      min = 0;
      max = this.FnbCreditCardBins.length;
      random = Math.floor(Math.random() * max + min);
      return this.FnbCreditCardBins[random];
    } else {
      min = 0;
      max = this.FnbDebitCardBins.length;
      random = Math.floor(Math.random() * max + min);
      return this.FnbDebitCardBins[random];
    }
  }

  /**
   * Checks if a bank card and it's checkdigit/checksum is valid and then returns true or false.
   *
   * @param number - The bank card number to check
   * @returns The validity of the checkdigit/checksum
   */
  private static isCheckDigitValid(number: string): boolean {
    if (
      number.length == 16 &&
      this.generateCheckDigit(number.substr(0, 15)) ==
        parseInt(number.substr(15))
    ) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the bank card is a FNB card and then returns true or false.
   *
   * @param number - The bank card number to check
   * @returns Whether or not it's a FNB card
   */
  private static isFNBCardNumber(number: string): boolean {
    let temp = number.substr(0, 6);
    for (let i = 0; i < this.FnbCreditCardBins.length; i++) {
      if (temp == this.FnbCreditCardBins[i]) {
        return true;
      }
    }
    for (let i = 0; i < this.FnbDebitCardBins.length; i++) {
      if (temp == this.FnbDebitCardBins[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks whether or not the bank card exists.
   *
   * @param number - The bank card number to check
   * @returns Whether or not the card exists
   */
  private static async doesCardExist(number: string): Promise<boolean> {
    const card = await db.getClientIdByCardNumber(number);
    return card != null;
  }

  /**
   * Generates a valid new bank card number.
   *
   * @param credit - Credit card or not
   * @returns The new card number
   */
  private static async generateNewCard(credit: boolean): Promise<string> {
    let number: string;
    let valid = false;
    while (!valid) {
      number = this.getBinNumber(credit);

      let min = 100000000;
      let max = 999999998;
      let random = Math.floor(Math.random() * max + min);
      number = number + random.toString();
      number = number + this.generateCheckDigit(number);

      valid = this.isCardNumberValid(number);
      if (valid) {
        let temp = await this.doesCardExist(number);
        valid = !temp;
      }
    }
    return number;
  }

  /**
   * Checks whether or not the rfid number exists.
   *
   * @param number - The rfid number to check
   * @returns Whether or not the card exists
   */
  private static async doesRfidExist(number: string): Promise<boolean> {
    const rfid = await db.getClientIdByRfid(number);
    return rfid != null;
  }

  /**
   * Generates a valid new rfid number
   *
   * @returns The new rfid number
   */
  private static async generateRfIDNumber(): Promise<string> {
    let number: string;
    let valid = false;
    while (!valid) {
      let min = 10000000;
      let max = 99999998;
      let random = Math.floor(Math.random() * max + min);
      number = random.toString();

      valid = this.isRfidNumberValid(number);
      if (valid) {
        let temp = await this.doesRfidExist(number);
        valid = !temp;
      }
    }
    return number;
  }

}
