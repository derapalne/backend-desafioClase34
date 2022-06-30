import {logger, loggerWarn, loggerError} from "../utils/logger.js"


const logRoute = (req, res, next) => {
    logger.info(`Ruta ${req.baseUrl + req.path} - Método ${req.method}`);
    next();
};

const logUndefinedRoute = (req, res, next) => {
    loggerWarn.warn(`Ruta ${req.baseUrl + req.path} - Método ${req.method} no definido`);
    next();
};

const error = (e) => {
    loggerError.error('Ha ocurrido un error:', e);
}

const info = (msg) => {
    logger.info(msg);
}

const trace = (msg) => {
    logger.trace(msg);
};

export default {logRoute, logUndefinedRoute, error, info, trace};
