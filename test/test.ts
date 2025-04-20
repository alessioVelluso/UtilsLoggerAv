import { FW, LogColors, Logger } from 'utils-logger-av';
import { c, Configs, i, log } from "./utils";

log.baseFile("Ciao", "log");
log.baseFile("Sono un errore", "error");

log.gold("If you specify a \"logFilePath\" in the constructor, you can use the \"logFileFunctions\"");
log.logFile("Hello world!");
log.logFile("You cannot love this library!", "error");
console.log('\n');

log.purple("If you need a file-logger, you can use the lighter WF class with the 'write' method");
log.purple("Use it as a micro-util if you have to split logs between various files");
const fw = new FW("LOGS/customLog.log");
fw.write("This is a different-file log");


log.base("You can print in white too but with the timestamp and format of all the other logs");

log.color(["green", "Hello how are you?"], "\t", c("lime", "Hope you like all of that"), c("purple", "Try out yourself!"));
console.log("\n");

log.ok("This is a \"Everything's good\" message");
log.nok("This is an error message");
console.log("\n");

log.magenta("The first parameter is colored", "The others are displayed like details: ", { test: "passed", style: true });
console.log("\n");

log.color([null, "White messages kind of important"], `${c("green", "\t\t...GOOD")}  ${i.check}`);
log.color(["gray", "Gray messages lesser important"], `${c("brown", "\t\t...CUSTOM")}  ${i.rocket}`);
log.color(["magenta", "Choose your preferred one"], `${c("red", "\t\t...BAD")}  ${i.cross}`);
console.log("\n");

(() => {
    try { throw new Error("The logError method manage the error message and the stacks in an error") }
    catch(err) { log.logError(err); }
})();
console.log("\n");

for (const color in Logger.colors) log.color([color as LogColors, "Look at this ...gradient?"]);
console.log("\n");




class BaseService extends FW
{
    protected readonly serviceName:string;
    constructor(serviceName:string) {
        super(`${Configs.LOG_FOLDER}/${serviceName}.log`);
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
