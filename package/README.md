# Utils Logger Av



`v3.2.2`

This is a package i made for myself but can surely be helpful to others, feel free to contribute if you like it.



## Install:

```bash
npm install utils-logger-av
```
You basically have the **Logger** class and the **FW** (filewriter) class.
1. The Logger class get us to log with colors and it's an extension of the previous one (not direclty, the methods are just doubled).
2. The FW class is a basic extendable/implementable class that impose you to specify a filepath for your logs. It will then print a nice-formatted log on that file.



## Logger Class

```ts
export interface ILogger {
    public static colors:Record<LogColors, string>;
    public static icons:Record<Icons, string>;

    getStringedColor: (color:LogColors, message:any) => string;
    ok: (message:string) => void;
    nok: (message:string) => void;

    color: ([LogColors | null, string], ...messages: string[]) => void;
    base: (coloredMessage:any, ...messages:any[]) => void;
    white: (coloredMessage:any, ...messages:any[]) => void;
    green: (coloredMessage:any,...messages:any[]) => void;
    red: (coloredMessage:any,...messages:any[]) => void;
    yellow: (coloredMessage:any,...messages:any[]) => void;
    blue: (coloredMessage:any,...messages:any[]) => void;
    magenta: (coloredMessage:any,...messages:any[]) => void;
    cyan: (coloredMessage:any,...messages:any[]) => void;
    gray: (coloredMessage:any,...messages:any[]) => void;
    orange: (coloredMessage:any,...messages:any[]) => void;
    pink: (coloredMessage:any,...messages:any[]) => void;
    purple: (coloredMessage:any,...messages:any[]) => void;
    teal: (coloredMessage:any,...messages:any[]) => void;
    brown: (coloredMessage:any,...messages:any[]) => void;
    lime: (coloredMessage:any,...messages:any[]) => void;
    gold: (coloredMessage:any,...messages:any[]) => void;
    violet: (coloredMessage:any,...messages:any[]) => void;

    logFile: (message:string, type?:"log" | "error") => void;
    logDetail: (coloredMessage:any, ...messages:any[]) => void;
    logError: (coloredMessage:any,...errs:any[]) => void;
}

// --- Default constructor values
private readonly logFilePath:string = null!;
private readonly isDebug:boolean = true;
protected readonly dateLocale:DateLocales = "it-IT";
protected readonly primaryColor:LogColors | null = null;
protected readonly isErrorStackFull:boolean = false;
protected readonly areIconsBeforeText:boolean = false;

export interface LoggerConstructor {
    logFilePath?:string,
    debug?:boolean,                 // if set to false, there won't be any more log.
    locale?: DateLocales,           // to set the locale timezone view
    primaryColor?:LogColors,        // set your color for the "base" method. default is white
    isErrorStackFull?:boolean       // if set to true, logError will log the full stack trace
    areIconsBeforeText?:boolean,
}
```




## Initialize the class

```ts
import { Logger } from "utils-logger-av"
```

You can export the default class like
```ts
const log = new Logger({ primaryColor:"cyan" });
export { log }
```


Or creating a new class extending mine to add some custom utilities
```ts
class MyLogger extends Logger
{
    public baseFile = (message:any, type:FileLogType) => {
        this.base(message);
        this.logFile(message, type)
    }
}

const log = new MyLogger({ logFilePath: `${Configs.LOG_FOLDER}/logs.log` });
const c = getStringedColor;
const i = Logger.icons;
export { c, i, log };
```


## Use the logger
You can now import the log object and call the related methods:
```ts
import { log } from "./your/filepath"; // I'm confident about your ide auto-import features

log.color("green", "Ciao")
log.base("Hello there, this is a log");
log.baseFile("Hello there", "log");
log.baseFile("An Error", "error");


log.orange("Another test", { test: 1, test2: true, prova: { test3: [ "Hello", 2, false] } }, false, 12.3);
log.white("This is white")
log.blue("This is blue")
log.brown("This is brown")
log.logError("This is an error", "err")
log.lime("This is lime")
log.teal("This is teal")
log.magenta("This is magenta")
```

## FW Class

```ts
protected readonly logFilePath:string;
protected readonly dateLocale:DateLocales = "it-IT";
constructor (logFilePath:string, locale?:DateLocales)
{
    this.logFilePath = logFilePath;
    if (locale) this.dateLocale = locale;
}

write = (message:string, type:FileLogType = "log") => void;
```

Use it to create micro-configurations for splitted log logics:
```ts
class BaseService extends FW
{
    protected readonly serviceName:string;
    constructor(serviceName:string) {
        super(`${Configs.LOG_FOLDER}/${serviceName}`);
        this.serviceName = serviceName;
    }

    protected writeLog = (message:string) => this.write(message);
    protected writeError = (message:string) => this.write(message, "error");
}

class MyService extends BaseService
{
    constructor()
    {
        super("Servizio_1");
    }

    firstServiceCustomMethod = () => {
        this.writeLog("Hi this is the first-service method")
    }
}

const serviceTest = new MyService();
serviceTest.firstServiceCustomMethod();
```
