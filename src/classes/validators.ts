import { CardManager } from "./card";

export const isNumber = (value) => {
  return /^\d+$/.test(value);
}

export const clientIdValidator = async (clientId: string) => {
  return isNumber(clientId);
}
export const exampleValidClientId = "1";
export const exampleValidClientId2 = "999";

export const cardValidator = async (card: string) => {
  return CardManager.isCardNumberValid(card);
}
export const exampleValidCard = "4195659888767522";
export const exampleValidCard2 = "4195662747483323";

export const rfidValidator = async (rfid: string) => {
  return CardManager.isRfidNumberValid(rfid);
}
export const exampleValidRfid = "12345678";

export const pinValidator = async (pin) => {
  return isNumber(pin) && pin.length > 4;
}
export const exampleValidPin = "12345";