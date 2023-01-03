import {
  bold,
  cyan,
  gray,
  green,
  magenta,
  red,
  white,
  yellowBright,
} from "chalk";
import { date, time } from "./utils/current";
import { low, up } from "./utils/strings";

//type for all possible log levels
export type LowLogLevels = "debug" | "info" | "warn" | "error";
export type UpLogLevels = "DEBUG" | "INFO" | "WARN" | "ERROR";
export type LogLevels = LowLogLevels | UpLogLevels;

//all format identities
// %L -> The current LogLevel in UPPERCASE (e.g. "INFO")
// %l -> The current LogLevel in lowercase (e.g. "info")
// %d -> The current date as YYYY-MM-DD (e.g. "2022-01-10")
// %t -> The current time as HH:MM:SS (e.g. "21:04:32")
// %m -> The message for the logger (e.g. "404 Not Found")

//type for all primitive error message
type ErrorMessagePrimitive =
  | boolean
  | null
  | number
  | string
  | undefined
  | object
  | Error;

//type for all error message
export type ErrorMessage =
  | ErrorMessagePrimitive
  | ((...args: any) => ErrorMessagePrimitive);

//interface for config values
export interface ILoggerConfig {
  debug: boolean;
  info: boolean;
  warn: boolean;
  error: boolean;
  format: string;
}

//type for a logger function
export type Loggerfunction = (level: LogLevels, message: ErrorMessage) => void;

//logger class
export class Logger {
  private config: ILoggerConfig;
  //constructor
  constructor(config?: Partial<ILoggerConfig>) {
    //set config
    this.config = {
      debug: config?.debug ?? true,
      info: config?.info ?? true,
      warn: config?.warn ?? true,
      error: config?.error ?? true,
      format: config?.format ?? "[%L] %t %m",
    };
  }

  //debug log
  public debug(message: ErrorMessage) {
    this.log("debug", message);
  }

  //info log
  public info(message: ErrorMessage) {
    this.log("info", message);
  }

  //warn log
  public warn(message: ErrorMessage) {
    this.log("warn", message);
  }

  //error log
  public error(message: ErrorMessage) {
    this.log("error", message);
  }

  //log function
  public log(level: LogLevels, message: ErrorMessage) {
    //transform log levels to lower
    const newLevel = low(level) as LowLogLevels;

    //check if should log
    if (!this.config[newLevel]) return;

    //format message
    const formattedMessage = this.format(newLevel, message);

    //log message
    console[newLevel](formattedMessage);
  }

  //format function
  public format(level: LowLogLevels, message: ErrorMessage) {
    //if message is function run function and use return value
    if (typeof message === "function") message = message();

    //color like original console
    if (typeof message === "boolean") message = yellowBright(message);
    if (typeof message === "number") message = yellowBright(message);
    if (message === null) message = bold(message);
    if (message === undefined) message = gray(message);

    //if message is error use error stack else use error message
    if (message instanceof Error)
      message = message.stack
        ? message.stack
            //color stack gray except message
            .split("\n")
            .map((line, idx) => (idx === 0 ? line : gray(line)))
            .join("\n")
        : `[${message.constructor.name}: ${message.message}]`;

    //convert any type of object to multi line stringified json
    if (typeof message === "object") message = JSON.stringify(message, null, 2);

    //convert to string
    message = String(message);

    //create loglevels
    let upLevel = up(level);
    let lowLevel = low(level);

    //transformer function
    let transformer: (_level: string) => string = (_level) => "";

    //format for level
    if (lowLevel === "debug") transformer = (_level: string) => magenta(_level);
    if (lowLevel === "info") transformer = (_level: string) => cyan(_level);
    if (lowLevel === "warn")
      transformer = (_level: string) => yellowBright(_level);
    if (lowLevel === "error")
      transformer = (_level: string) => bold(red(_level));

    //transform (apply) colors
    upLevel = transformer(upLevel);
    lowLevel = transformer(lowLevel);

    //process message
    return (
      message
        //split the message into lines
        .split("\n")
        //map over all lines
        .map((line) => {
          //format and return each line
          return this.config.format
            .replace("%d", bold(green(date())))
            .replace("%t", bold(gray(time())))
            .replace("%L", upLevel)
            .replace("%l", lowLevel)
            .replace("%m", line);
        })
        //join all lines back together
        .join("\n")
    );
  }
}

//wrapper for new Logger
export function createLogger(config?: Partial<ILoggerConfig>) {
  return new Logger(config);
}
