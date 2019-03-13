export class Log {
  private static instance = null;
  public static getInstance() {
    if (Log.instance === null) {
      Log.instance = new Log();
    }
    return Log.instance;
  }
  
  private constructor() {}

  // code
  
  public addToLog(logItem: LogItem) : Promise<void> {
    return new Promise((resolve, reject) => {
      // code
      resolve();
    });
  }
  public getFromLog(startDate: Date, endDate: Date) : Promise<LogItem[]> {
    return new Promise((resolve, reject) => {
      // code
      resolve([]);
    });
  }

}

export interface LogItem {
  time: Date;
  parameters: any;
  ip: any;
  url: string;
  method: string;
  headers: any;
}