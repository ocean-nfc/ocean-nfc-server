import * as fs from "fs";

export class Log {
    private jsonfile = require('jsonfile');

    private static instance = null;
    public static getInstance(): Log {
        if (Log.instance === null) {
            Log.instance = new Log();
        }
        return Log.instance;
    }

    private constructor() {}

    /**
     * Initialises the json log file
     */

    public initialiseLogFile() {
        const file = '/Logs/logs.json';
        const header = { system: 'CRDS' }

        this.jsonfile.writeFileSync(file, header, function (err) {
            if(err) console.error(err)});
    }

    /**
     * Adds an item to the log file
     * @param logData  
     */
    public addLogItem(logData) {

        const file = '/Logs/logs.json';
        const log =
        { 
            date: logData[0],
            statusCode: logData[1],
            method: logData[2],
            url: logData[3],
            query: logData[4],
            ip: logData[5]
        }
        this.jsonfile.writeFileSync(file, log, {flag: 'a+'}, function (err) {
            if(err) console.error(err)
        });
        console.log('Log Item was appended to file.');
    }

    public async reset() {
        await this.initialiseLogFile();
    }
}