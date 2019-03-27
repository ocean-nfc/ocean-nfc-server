import { Database } from './../classes/database';

/**
 * This class is used to create, read, update and deactivates client's bank cards.
 */
export class Card {

  readonly FnbCreditCardBins: string[] = [
    "419565",
    "419566",
    "419567",
  ]

  readonly FnbDebitCardBins: string[] = [
    "419570"
  ]

  /**
   * Generates and returns the checkdigit/checksum for the card number.
   * 
   * @param number - The card number that is used to generate a checkdigit/checksum
   * @returns The number's checkdigit/checksum
   */
  private generateCheckDigit(number: string): number {
    let total = 0;
    let parity = 2;
    for (let i = number.length - 1; i >= 0; i--) {
      let single = Math.max(parity, 1) * parseInt(number[i]);
      if (single > 9) {
        let temp = single.toString().split('').map(Number);
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
  private getBinNumber(credit: boolean): string {
    let min: number;
    let max: number;
    let random: number;
    if (credit) {
      min = 0;
      max = this.FnbCreditCardBins.length;
      random = Math.floor((Math.random() * max) + min);
      return this.FnbCreditCardBins[random];
    } else {
      min = 0;
      max = this.FnbDebitCardBins.length;
      random = Math.floor((Math.random() * max) + min);
      return this.FnbDebitCardBins[random];
    }
  }

  /**
   * Checks if a bank card and it's checkdigit/checksum is valid and then returns true or false.
   * 
   * @param number - The bank card number to check
   * @returns The validity of the checkdigit/checksum
   */
  private isCheckDigitValid(number: string): boolean {
    if (
      (number.length == 16) && 
      ((this.generateCheckDigit(number.substr(0, 15)) == parseInt(number.substr(15))))
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
  private isFNBCardNumber(number: string): boolean {
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
  private async doesCardExist(number: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      let db = Database.getInstance();
      let count = await db.all("SELECT COUNT(*) FROM db WHERE cardNumber=?", [
        number
      ]);
      if(count[0]['COUNT(*)'] == 0){
        resolve(false);
      }else{
        resolve(true);
      }
    });
  }

  /**
   * Checks whether or not the bank card is valid by performing a selection of tests.
   * 
   * @param number - The bank card number to check
   * @returns Whether or not it's valid
   */
  public isCardNumberValid(number: string): boolean {
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
   * Generates a valid new bank card number.
   * 
   * @param credit - Credit card or not
   * @returns The new card number
   */
  private async generateNewCard(credit: boolean): Promise<string> {
    let number: string;
    let valid = false;
    while (!valid) {
      number = this.getBinNumber(credit);
      
      let min = 100000000;
      let max = 999999999;
      let random = Math.floor((Math.random() * max) + min);
      number = number + random.toString();
      number = number + this.generateCheckDigit(number);

      valid = this.isCardNumberValid(number);
      if(valid){
        let temp = await this.doesCardExist(number);     
        valid = !temp;
      }
    }
    return number;
  }

  /**
   * Generates a new bank card and save it to the database with the client's ID.
   * 
   * @param clientID - Who's card it is
   * @param credit - Credit card or not
   * @param rfID - RfID for the card
   * @returns The new card number
   */
  public async createNewCard(clientID: string, credit: boolean, rfID?: string,): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if(!rfID){
        rfID = null;
      }
      let number = await this.generateNewCard(credit);
      let db = Database.getInstance();
      db.run(`INSERT INTO db VALUES (?, ?, ? ,?)`, [
        clientID,
        rfID,
        number,
        null
      ]);
      resolve(number);
    });
  }

  public deactivateCardByRfid() {
      
  }

  public deactivateCardByNumber() {
      
  }

  public deactivateAllCards() {

  }

}