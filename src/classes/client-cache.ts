const sqlite = require("sqlite3");

export class ClientCache {
  // singleton instantiation
  private static instance = null;
  public static getInstance() {
    if (ClientCache.instance === null) {
      ClientCache.instance = new ClientCache();
    }
    return ClientCache.instance;
  }

  private constructor() {

  }


  public getClientId(cardId: string) : Promise<string> {
    return new Promise((resolve, reject) => {
      // TODO: cache code

      resolve("the id");
    });
  }

}