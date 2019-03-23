export const cardValidator = async (card: string) => {
  return card.length == 16 && /^\d+$/.test(card);
}

export const rfidValidator = async (rfid: string) => {
  return rfid.length > 0;
}