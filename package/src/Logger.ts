import { appendFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { DateLocales, FileLogType, Icons, LogColors, LoggerConstructor } from "../types/generic.types";
import { autobind } from "./Autobind";
export interface ILogger {
    // colors:Record<LogColors, string>; --- static
    // icons:Record<Icons, string>; --- static

    ok(message:string): void;
    nok(message:string): void;
    fullOk(message:string): void;
    fullNok(...errors:any[]): void;

    base(coloredMessage:any, ...messages:any[]): void;
    white(coloredMessage:any, ...messages:any[]): void;
    green(coloredMessage:any,...messages:any[]): void;
    red(coloredMessage:any,...messages:any[]): void;
    yellow(coloredMessage:any,...messages:any[]): void;
    blue(coloredMessage:any,...messages:any[]): void;
    magenta(coloredMessage:any,...messages:any[]): void;
    cyan(coloredMessage:any,...messages:any[]): void;
    gray(coloredMessage:any,...messages:any[]): void;
    orange(coloredMessage:any,...messages:any[]): void;
    pink(coloredMessage:any,...messages:any[]): void;
    purple(coloredMessage:any,...messages:any[]): void;
    teal(coloredMessage:any,...messages:any[]): void;
    brown(coloredMessage:any,...messages:any[]): void;
    lime(coloredMessage:any,...messages:any[]): void;
    gold(coloredMessage:any,...messages:any[]): void;
    violet(coloredMessage:any,...messages:any[]): void;

    combo(firstString:[LogColors, string] | string, ...messages: string[]): void;
    file(message:string, type?:"log" | "error"): void;
    detail(coloredMessage:any, ...messages:any[]): void;
    error(coloredMessage:any,...errs:any[]): string | undefined;
    date(color?:LogColors): string;
}


export const getStringedColor = (color:LogColors, message:any) => {
    if (typeof message === "object") return Logger.colors[color].replace("%s", `${JSON.stringify(message, null, 2)}`);
    else return Logger.colors[color].replace("%s", `${message}`)
}

export default class Logger implements ILogger
{
    protected logFilePath:string = null!;
    protected readonly stopEveryLog:boolean = false;
    protected readonly dateLocale:DateLocales = "it-IT";
    protected readonly primaryColor:LogColors | null = null;
    protected readonly isErrorStackFull:boolean = false;
    protected readonly areIconsBeforeText:boolean = true;
    constructor(data?:LoggerConstructor) {
        if (data?.logFilePath) this.logFilePath = data.logFilePath;
        if (data?.stopEveryLog) this.stopEveryLog = data.stopEveryLog;
        if (data?.locale) this.dateLocale = data.locale;
        if (data?.primaryColor) this.primaryColor = data.primaryColor;
        if (data?.isErrorStackFull !== undefined) this.isErrorStackFull = data.isErrorStackFull
        if (data?.areIconsBeforeText) this.areIconsBeforeText = data.areIconsBeforeText;

        this.colorsKeys = Object.keys(Logger.colors);
        autobind(this);
    }





    protected static readonly dateOptions: Intl.DateTimeFormatOptions | undefined = { day: '2-digit', month: '2-digit', year: 'numeric' };
    protected static readonly timeOptions: Intl.DateTimeFormatOptions | undefined = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
    protected readonly colorsKeys:string[];
    public static readonly colors:Record<LogColors, string> = {
        red: "\x1b[31m%s\x1b[0m",
        green: "\x1b[32m%s\x1b[0m",
        yellow: "\x1b[33m%s\x1b[0m",
        blue: "\x1b[34m%s\x1b[0m",
        magenta: "\x1b[35m%s\x1b[0m",
        cyan: "\x1b[36m%s\x1b[0m",
        gray: "\x1b[90m%s\x1b[0m",
        orange: "\x1b[38;5;214m%s\x1b[0m",
        pink: "\x1b[38;5;13m%s\x1b[0m",
        purple: "\x1b[38;5;93m%s\x1b[0m",
        teal: "\x1b[38;5;44m%s\x1b[0m",
        brown: "\x1b[38;5;94m%s\x1b[0m",
        lime: "\x1b[38;5;118m%s\x1b[0m",
        gold: "\x1b[38;5;220m%s\x1b[0m",
        violet: "\x1b[38;5;177m%s\x1b[0m"
    }
    public static readonly icons: Record<Icons, string> =
    {
        check: "\u2705",             // ✅ Check verde (OK)
        cross: "\u274C",             // ❌ Croce rossa (Errore)
        warning: "\u26A1",           // ⚡ Fulmine (alternativa al simbolo di avvertimento)
        info: "\u2139\uFE0F",        // ℹ️ Simbolo informazioni (alternativa più moderna)
        refresh: "\u{1F504}",        // 🔄 Aggiornamento o processo in corso
        arrowRight: "\u{1F862}",     // 🡢 Freccia destra alternativa
        arrowLeft: "\u{1F860}",      // 🡠 Freccia sinistra alternativa
        arrowUp: "\u{1F861}",        // 🡡 Freccia su alternativa
        arrowDown: "\u{1F863}",      // 🡣 Freccia giù alternativa
        star: "\u2B50",              // ⭐ Stella
        heart: "\u2764",             // ❤️ Cuore
        fire: "\u{1F525}",           // 🔥 Fuoco
        lock: "\u{1F512}",           // 🔒 Lucchetto
        unlock: "\u{1F513}",         // 🔓 Lucchetto aperto
        hourglass: "\u231B",         // ⌛ Clessidra
        hourglassFlow: "\u23F3",     // ⏳ Clessidra con sabbia che scorre
        rocket: "\u{1F680}",         // 🚀 Razzo
        party: "\u{1F389}",          // 🎉 Party popper
        search: "\u{1F50D}",         // 🔍 Lente di ingrandimento
        trash: "\u{1F5D1}\uFE0F",    // 🗑️ Cestino (con variante emoji colorata)
        clip: "\u{1F4CE}",           // 📎 Graffetta
        bulb: "\u{1F4A1}",           // 💡 Lampadina
        book: "\u{1F4D6}",           // 📖 Libro
        folder: "\u{1F4C2}",         // 📂 Cartella
        globe: "\u{1F30D}",          // 🌍 Globo (Europa/Africa)
        globeAmericas: "\u{1F30E}",  // 🌎 Globo (Americhe)
        globeAsia: "\u{1F30F}",      // 🌏 Globo (Asia/Australia)
        cloud: "\u2601\uFE0F",       // ☁️ Nuvola colorata
        sun: "\u2600\uFE0F",         // ☀️ Sole colorato
        moon: "\u{1F319}",           // 🌙 Luna
        snowflake: "\u{1F9CA}",      // 🧊 Cubetto di ghiaccio (alternativa al fiocco di neve)
        calendar: "\u{1F4C5}",       // 📅 Calendario
        bell: "\u{1F514}",           // 🔔 Campanella
        email: "\u{1F4E7}",          // 📧 Email
        phone: "\u{1F4DE}",          // 📞 Telefono
        settings: "\u2699",          // ⚙️ Ingranaggio
        user: "\u{1F464}",           // 👤 Utente
        users: "\u{1F465}",          // 👥 Utenti
        home: "\u{1F3E0}",           // 🏠 Casa
        clock: "\u{1F550}",          // 🕐 Orologio
        chart: "\u{1F4C8}",          // 📈 Grafico crescente
        money: "\u{1F4B0}",          // 💰 Sacchetto di denaro
        thumbsUp: "\u{1F44D}",       // 👍 Pollice in su
        thumbsDown: "\u{1F44E}",     // 👎 Pollice in giù
        camera: "\u{1F4F7}",         // 📷 Fotocamera
        video: "\u{1F4F9}",          // 📹 Videocamera
        music: "\u{1F3B5}",          // 🎵 Nota musicale
        pin: "\u{1F4CD}",            // 📍 Puntina
        tag: "\u{1F3F7}",            // 🏷️ Etichetta
        flag: "\u{1F6A9}",           // 🚩 Bandiera
    }



    protected _getDateTimeString()
    {
        const dateObj = new Date();
        return `[${dateObj.toLocaleDateString(this.dateLocale, Logger.dateOptions)} ${dateObj.toLocaleTimeString(this.dateLocale, Logger.timeOptions)}]   `;
    }

    protected _log(message:any, color:LogColors | null = null)
    {
        if (this.stopEveryLog) return;

        const dateString = this._getDateTimeString();
        if (!color) console.log(`${dateString}${message}`);
        else
        {
            if (typeof message === "object") console.log(Logger.colors[color], `${dateString}${JSON.stringify(message, null, 2)}`);
            else console.log(Logger.colors[color], `${dateString}${message}`);
        }
    }

    protected _color(color:LogColors | null, coloredMessage:any, ...messages:any[])
    {
        if (this.stopEveryLog) return;

        this._log(coloredMessage, color);
        for (let i = 0; i < messages.length; i++) {
            this.detail(messages[i]);
        }
    }



    ok(message:string)
    {
        if (this.stopEveryLog) return;

        if (!this.areIconsBeforeText) this._color("green", `${message}  \u2705`);
        else this._color("green", `${Logger.icons.check}  ${message}`);
    };

    nok(message:string)
    {
        if (this.stopEveryLog) return;

        if (!this.areIconsBeforeText) this._color("red", `${message}  ${Logger.icons.cross}`);
        else this._color("red", `${Logger.icons.cross}  ${message}`);
    };

    fullOk(message:string)
    {
        if (this.stopEveryLog) return;

        const finalMessage = this.areIconsBeforeText ? `${Logger.icons.check}  ${message}` : `${message}  ${Logger.icons.check}`;
        this._color("green", finalMessage);
        this.file(finalMessage, "log");
    };

    fullNok(...errs:any[])
    {
        if (this.stopEveryLog) return;

        const message = this.error(Logger.icons.cross, ...errs);
        if (message) this.file(message, "error");
    };



    base(coloredMessage: any, ...messages: any[]) { this._color(this.primaryColor, coloredMessage, ...messages) }
    white(coloredMessage: any, ...messages: any[]) { this._color(null, coloredMessage, ...messages) }
    green(coloredMessage: any, ...messages: any[]) { this._color('green', coloredMessage, ...messages) }
    red(coloredMessage: any, ...messages: any[]) { this._color('red', coloredMessage, ...messages) }
    yellow(coloredMessage: any, ...messages: any[]) { this._color('yellow', coloredMessage, ...messages) }
    blue(coloredMessage: any, ...messages: any[]) { this._color('blue', coloredMessage, ...messages) }
    magenta(coloredMessage: any, ...messages: any[]) { this._color('magenta', coloredMessage, ...messages) }
    cyan(coloredMessage: any, ...messages: any[]) { this._color('cyan', coloredMessage, ...messages) }
    gray(coloredMessage: any, ...messages: any[]) { this._color('gray', coloredMessage, ...messages) }
    orange(coloredMessage: any, ...messages: any[]) { this._color('orange', coloredMessage, ...messages) }
    pink(coloredMessage: any, ...messages: any[]) { this._color('pink', coloredMessage, ...messages) }
    purple(coloredMessage: any, ...messages: any[]) { this._color('purple', coloredMessage, ...messages) }
    teal(coloredMessage: any, ...messages: any[]) { this._color('teal', coloredMessage, ...messages) }
    brown(coloredMessage: any, ...messages: any[]) { this._color('brown', coloredMessage, ...messages) }
    lime(coloredMessage: any, ...messages: any[]) { this._color('lime', coloredMessage, ...messages) }
    gold(coloredMessage: any, ...messages: any[]) { this._color('gold', coloredMessage, ...messages) }
    violet(coloredMessage: any, ...messages: any[]) { this._color('violet', coloredMessage, ...messages) }
    detail(...messages:any[])
    {
        if (this.stopEveryLog) return;

        for (const message of messages) {
            if (typeof message === "object") console.log(Logger.colors["gray"], JSON.stringify(message, null, 2));
            else console.log(Logger.colors["gray"], `${message}`);
        }
    }




    /*
    * @Description
    * Pass any string and if you want to pass the direct error, pass it as the last param (or the only one)
    */
    error(...errs:any[]):string | undefined
    {
        if (this.stopEveryLog) return undefined;


        let stackTrace:string = null!;
        let errorMessage:string = '';

        for(let i = 0; i < errs.length; i++)
        {
            errorMessage += errs[i]?.message ?? errs[i];
            if (i < errs.length - 1) errorMessage += " "
            if (errs[i].stack)
            {
                if (this.isErrorStackFull) stackTrace = errs[i].stack
                else stackTrace = errs[i].stack.split("\n")[1];
            }
        }

        this._log(errorMessage, "red")
        if (stackTrace) console.log(Logger.colors["gray"], stackTrace)

        return errorMessage;
    }

    file(message:string, type:FileLogType = "log")
    {
        if (!this.logFilePath || this.stopEveryLog) return;

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

    combo(firstString:[LogColors, string] | string, ...messages: string[])
    {
        if (this.stopEveryLog) return;

        let finalMessage:Array<LogColors | any> = [];
        if (typeof firstString === "string") firstString = [null!, firstString];
        const [firstColor, firstMessage] = firstString as [LogColors | null, string];

        finalMessage.push(firstColor === null ? `${this._getDateTimeString()}${firstMessage}` : Logger.colors[firstColor].replace("%s", `${this._getDateTimeString()}${firstMessage}`))
        for (const message of messages) finalMessage.push(message);

        console.log(...finalMessage);
    }

    date(color?:LogColors):string
    {
        if (color === undefined) return this._getDateTimeString();
        else return Logger.colors[color].replace("%s", this._getDateTimeString());
    }
}
