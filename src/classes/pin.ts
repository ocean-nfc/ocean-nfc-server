//import { forge } from "node-forge"

/**
 * This class is used to create, update and verify a card's pin number.
 */
export class PinManager {
  /**
   * Generates a new card pin, notifies the client of the new pin and then returns it.
   *
   * @param clientID - Who's card's pin is it
   * @returns The new pin
   */
  public static async createNewPin(): Promise<{ pin: string; hash: string }> {
    let pin = await this.generateNewPin();
    let pinhash = await this.generatePinHash(pin);
    //@TODO: Contact Notification Subsystem with Generated Pin and clientID
    return {
      pin: pin,
      hash: pinhash
    };
  }

  /**
   * Checks if a pin is valid or not and then returns true or false based on result.
   *
   * @param pin - Pin to check
   * @param pinhash - Pin to check against in hash form
   * @returns Whether or not the pin is correct.
   */
  public static async verifyPinHash(
    pin: string,
    pinhash: string
  ): Promise<boolean> {
    let salt = pinhash.substr(0, 40);
    let newHash = await this.generatePinHash(pin, salt);
    if (pinhash == newHash) {
      return true;
    }
    return false;
  }

  /**
   * Generates a new unhashed pin number.
   *
   * @returns The new pin number
   */
  private static async generateNewPin(): Promise<string> {
    let pin = "";
    let length = 5;
    let min = 0;
    let max = 10;
    let random = 0;
    for (let i = 0; i < length; i++) {
      random = Math.floor(Math.random() * max + min);
      pin = pin + random.toString();
    }
    return pin;
  }

  /**
   * Generate a hash for the pin number.
   *
   * @param pin - The pin number to hash
   * @param salt - Salt if one exists
   * @returns The pin number's hash
   */
  public static async generatePinHash(
    pin: string,
    salt?: string
  ): Promise<string> {
    let forge = require("node-forge"); //Import at the top of class doens't work.
    let hasher = forge.md.sha512.sha256.create();
    if (!salt) {
      salt = this.getSalt();
    }
    hasher.update(salt + pin);
    let hash = salt + hasher.digest().toHex();
    return hash;
  }

  /**
   * Generates a new random salt
   *
   * @returns The new salt
   */
  private static getSalt(): string {
    let forge = require("node-forge"); //Import at the top of class doens't work.
    let shasher = forge.md.sha1.create();
    shasher.update(forge.random.getBytesSync(16));
    let salt = shasher.digest().toHex();
    return salt;
  }
}
