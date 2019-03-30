import * as jsonfile from "jsonfile";
import * as axios from "axios";

export class Log {
  private static instance = null;
  public static getInstance(): Log {
    if (Log.instance === null) {
      Log.instance = new Log();
    }
    return Log.instance;
  }

  private constructor() {}
  private file = "./log.json";
  private logCounter = 0;

  /**
   * Initialises the json log file
   */
  public initialiseLogFile() {
    const header = { system: "CRDS", data: [] };
    this.writeToLogFile(header);
    console.log("Log file has been initialised.");
  }

  /**
   * Adds an item to the log file
   * @param logData
   */
  public addLogItem(logData) {
    const file = "./log.json";
    const log = {
      date: logData[0],
      statusCode: logData[1],
      method: logData[2],
      url: logData[3],
      query: logData[4],
      ip: logData[5]
    };

    fileObj['data'].push(log);
    this.writeToLogFile(fileObj);
    this.logCounter++;
    console.log("Log Item was appended to file.");
  }

  /**
   * Writes the logs into the log file
   * @param jsonObj 
   */
  private writeToLogFile(jsonObj) {
    jsonfile.writeFileSync(this.file, jsonObj, { flag: "w"} , function(err) {
      if (err) console.error(err);
    });    
  }

  /**
   * Sends the log file data to the reporting subsystem
   * @param fileData 
   */
  private sendLogFile(fileData) {
    axios.default.post("https://fnbreports-6455.nodechef.com/api",fileData)
    .then((res) => {
      console.log("Log file has be sent to reporting statusCode: ${res.statusCode}");
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
    this.logCounter = 0;
  }

  public async reset() {
    await this.initialiseLogFile();
  }
}
