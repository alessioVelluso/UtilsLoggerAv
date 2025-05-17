// --- Logger
export type FileLogType = "log" | "error";
export type Icons =
  | 'check'
  | 'cross'
  | 'warning'
  | 'info'
  | 'refresh'
  | 'arrowRight'
  | 'arrowLeft'
  | 'arrowUp'
  | 'arrowDown'
  | 'star'
  | 'heart'
  | 'fire'
  | 'lock'
  | 'unlock'
  | 'hourglass'
  | 'hourglassFlow'
  | 'rocket'
  | 'party'
  | 'search'
  | 'trash'
  | 'clip'
  | 'bulb'
  | 'book'
  | 'folder'
  | 'globe'
  | 'globeAmericas'
  | 'globeAsia'
  | 'cloud'
  | 'sun'
  | 'moon'
  | 'snowflake'
  | 'calendar'
  | 'bell'
  | 'email'
  | 'phone'
  | 'settings'
  | 'user'
  | 'users'
  | 'home'
  | 'clock'
  | 'chart'
  | 'money'
  | 'thumbsUp'
  | 'thumbsDown'
  | 'camera'
  | 'video'
  | 'music'
  | 'pin'
  | 'tag'
  | 'flag';


export type LogColors =
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "gray"
    | "orange"
    | "pink"
    | "purple"
    | "teal"
    | "brown"
    | "lime"
    | "gold"
    | "violet"

export interface LoggerConstructor {
    logFilePath?:string,
    stopEveryLog?:boolean,
    locale?: DateLocales,
    primaryColor?:LogColors,
    isErrorStackFull?:boolean,
    areIconsBeforeText?:boolean,
}


// --- Locales
export type DateLocales =
    | "en-US"
    | "en-GB"
    | "fr-FR"
    | "de-DE"
    | "it-IT"
    | "es-ES"
    | "ja-JP"
    | "zh-CN";
