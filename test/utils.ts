import { Logger, getStringedColor } from "utils-logger-av";

export class Configs
{
    static LOG_FOLDER = "LOGS";
}
// You can override  it to use it a class for all your different utils, or simply use the default class like
// export default new Logger({
//     debug:true,
//     logFilePath: "../files/logs.txt"
// });


// Anyway, i suggest it to use it in a static way, so creating a single object and exporting it for all the project.
// (you can obviously avoid to create a class extending mine)
class MyLogger extends Logger
{
    override fullNok(...errs: any[]): void
    {
        this.detail("Overriding fullNok and printing filePath: ", this.logFilePath);
        super.fullNok(...errs);
    }

    public loggingAllIcons()
    {
        this.combo(['teal', 'Printing all the icons...'])
        for (const icon in Logger.icons) this.detail(`${icon} ${(Logger.icons as Record<string, any>)[icon]}`)
    }
}

const log = new MyLogger({ logFilePath: `${Configs.LOG_FOLDER}/logs.log` });
const c = getStringedColor;
const i = Logger.icons;
export { c, i, log };
