import log4js from 'log4js';

// >>>>>Configuración del Logger

log4js.configure({
    appenders: {
        consola: { type: "console" },
        archivoWarn: { type: "file", filename: "warn.log" },
        archivoError: { type: "file", filename: "error.log" },
        loggerWarn: { type: "logLevelFilter", appender: "archivoWarn", level: "warn" },
        loggerError: { type: "logLevelFilter", appender: "archivoError", level: "error" },
    },
    categories: {
        default: { appenders: ["consola"], level: "all" },
        warnLogger: { appenders: ["consola", "loggerWarn"], level: "warn" },
        errorLogger: { appenders: ["consola", "loggerError"], level: "error" },

    },
});

const logger = log4js.getLogger();
const loggerWarn = log4js.getLogger("warnLogger");
const loggerError = log4js.getLogger("errorLogger");

export  {logger, loggerWarn, loggerError};