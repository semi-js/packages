import { createLogger, ILoggerConfig, Logger } from "../../dist"; //replace with "@semi-js/logger"

//options for logger1
const opts1: ILoggerConfig = {
  debug: true,
  info: true,
  warn: true,
  error: true,
  format: "[%L] %t %m",
};

//options for logger2
const opts2: ILoggerConfig = {
  debug: true,
  info: true,
  warn: true,
  error: true,
  format: "[%l] %d %m",
};

//class method to create a logger
const logger1 = new Logger(opts2);

//wrapper method to create a logger
const logger2 = createLogger(opts1);

//log a boolean via .log method with level argument (debug)
console.debug(true);
logger1.log("debug", true);

//log a number via .log method with level argument (info)
console.info(123);
logger1.log("info", 123);

//log a string via .log method with level argument (warn)
console.warn("An Error occured");
logger1.log("warn", "An Error occured");

//log null via .log method with level argument (error)
console.error(null);
logger1.log("error", null);

//log Error class via .[level] method (debug)
console.debug(new Error("test"));
logger2.debug(new Error("test"));

//log undefined via .[level] method (info)
console.info(undefined);
logger2.info(undefined);

//log object via .[level] method (warn)
console.warn({ a: 1, b: { c: 2 } });
logger2.warn({ a: 1, b: { c: 2 } });

//log a function (the callback will be run and the return value logged) via .[level] method (error)
logger2.error(() => "Returned error message from callback function!");

class ExtendedError extends Error {}

//special things about the Error class:
//by default the error stack will be logged, if the stack is not defined @semi-js/logger will fall back to the error message
//create both errors
const err1 = new Error("Error with stack");
const err2 = new Error("Error without stack");
const err3 = new ExtendedError("Extended error without stack");

//remove stack from err2 and err3
err2.stack = undefined;
err3.stack = undefined;

//log err1
console.error(err1);
logger1.error(err1);

//log err2
console.error(err2);
logger2.error(err2);

//log err2
console.error(err3);
logger2.error(err3);

//format function (return formatted string with prefrences of logger)
console.debug(logger1.format("debug", "message"));
