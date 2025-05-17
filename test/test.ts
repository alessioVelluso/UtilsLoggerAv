import { FW, LogColors, Logger } from 'utils-logger-av';
import { c, Configs, i, log } from "./utils";

// --- Intro
console.log(c("magenta", "Hello there!"), c("purple", "This is a little library i made for myself"))
console.log(`${c("teal", "Check it out")} ${c("cyan", "and let me know what you think!")}`)
console.log('\n');

// --- Icons
log.loggingAllIcons();
console.log('\n');

// --- File
log.gold("If you specify a \"logFilePath\" in the constructor, you can use the \"logFileFunctions\"", "...(Writing in file specified in the constructor)...");
log.file("Hello world!");
log.file("Hope you like this library!", "error");
console.log('\n');

// --- White
log.base("You can print in white too but with the timestamp and format of all the other logs");
log.combo("Another example of white text", c("magenta", "transofrming into a colored one"));
log.combo(["green", "Or you can start with a color"], c("lime", "and keep on with others."), c("purple", "Try out yourself!"));
console.log("\n");

// --- Ok/Nok/Full
log.ok("This is a \"Everything's good\" message");
log.fullOk("This is the same but writing in a file too through the \"logFilePath\" property");
log.detail("...(writing in file)...")
log.nok("This is an error message");
log.fullNok("This is the same but writing in a file too through the \"logFilePath\" property");
log.detail("...(writing in file)...")
console.log("\n");

// --- Parameters exaplanation
log.magenta("The first parameter is colored", "The others are displayed like details: ", { test: "passed", style: true });
console.log("\n");


// --- Full Nok With Thrown Error Messages
(() => {
    try { throw new Error("The logError method manage the error message and the stacks in an error") }
    catch(err) { log.fullNok("TEST", err); }
})();
console.log("\n");

// --- Custom stuff
log.combo("White messages kind of important", `${c("green", "\t...GOOD")}  ${i.check}`);
log.combo(["gray", "Gray messages lesser important"], `${c("brown", "\t\t...CUSTOM")}  ${i.rocket}`);
log.combo(["magenta", "Choose your preferred one"], `${c("red", "\t\t...BAD")}  ${i.cross}`);
console.log('\n');

for (const color in Logger.colors) log.combo([color as LogColors, "Look at this ...gradient?"]);
console.log("\n");




// --- FILE WRITER CLASS --- //
log.purple("If you need a file-logger, you can use the lighter WF class with the 'write' method");
log.detail("Use it as a micro-util if you have to split logs between various files");
log.detail("...(writing in file customFileWriterLog.log for WF class test)...")
const fw = new FW("LOGS/customFileWriterLog.log");
fw.write("This is a different-file log");
console.log('\n');

log.yellow("Check out the code on how hypothetically you could use it within a service-like-class");
log.detail("Check the code below this log!")
log.detail("...(writing in file Service_1.log for WF class test)...")
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
        super("Service_1");
    }

    firstServiceCustomMethod = () => {
        this.writeLog("Hi this is the first-service method")
    }
}

const serviceTest = new MyService();
serviceTest.firstServiceCustomMethod();
