import { appendFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { DateLocales, FileLogType } from "../types/generic.types";

export default class FW
{
    protected static readonly dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    protected static readonly timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }

    protected readonly logFilePath:string;
    protected readonly dateLocale:DateLocales = "it-IT";

    constructor (logFilePath:string, locale?:DateLocales)
    {
        this.logFilePath = logFilePath;
        if (locale) this.dateLocale = locale;
    }

    protected _getDateTimeString = () => {
        const dateObj = new Date();
        return `[${dateObj.toLocaleDateString(this.dateLocale, FW.dateOptions)} ${dateObj.toLocaleTimeString(this.dateLocale, FW.timeOptions)}]   `;
    }

    write (message:string, type:FileLogType = "log")
    {
        // Managing possible classes extending this one, so the parent can have a nullable value but required within this constructor.
        if (this.logFilePath === null) throw new Error("You need to specify a log file path to write on it.");

        if (!existsSync(this.logFilePath))
        {
            const fullPath = path.resolve(this.logFilePath);
            const dir = path.dirname(fullPath);
            if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        }

        const date = this._getDateTimeString().trim();
        const logType = type === "log" ? "  LOG" : "ERROR"
        appendFileSync(this.logFilePath, `${date}\t\t${logType}:  ${message}\n`)
    }
}
