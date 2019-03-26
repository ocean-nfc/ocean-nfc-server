import * as fs from "fs";

export class Log {
    private static instance = null;
    public static getInstance(): Log {
        if (Log.instance === null) {
            Log.instance = new Log();
        }
        return Log.instance;
    }

    private constructor() {}

    /**
     * Adds an item to the log file
     * @param date 
     * @param statusCode 
     * @param method 
     * @param url 
     * @param query 
     * @param ip  
     */
    public addLogItem(date, statusCode, method, url, query: string, ip): Promise<void> {
        const logData = date;
        logData.join(" ");
        logData.join(statusCode);
        logData.join(" ");
        logData.join(method);
        logData.join(" ");
        logData.join(url);
        logData.join(" ");
        logData.join(query);
        logData.join(" ");
        logData.join(ip);
        fs.appendFileSync("logs.txt", logData, (err) => {
            if(err) throw err;
            console.log('Log Item was appended to file.');
        });
        return;
    }
}