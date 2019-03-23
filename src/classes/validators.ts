export const isNumber = (value) => {
  return /^\d+$/.test(value);
}

export const clientIdValidator = async (clientId: string) => {
  return isNumber(clientId);
}
export const exampleValidClientId = "1";

export const cardValidator = async (card: string) => {
  return card.length == 16 && isNumber(card);
}
export const exampleValidCard = "1234123412341234";

export const rfidValidator = async (rfid: string) => {
  return isNumber(rfid) && rfid.length == 8;
}
export const exampleValidRfid = "12345678";