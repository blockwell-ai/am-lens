const winston = require('winston');
const ContextLogger = require('./ContextLogger');

const log = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});
module.exports = log;

module.exports.request = function(ctx, time) {
    log.debug('HTTP Request', {
        method: ctx.method,
        url: ctx.originalUrl,
        status: ctx.status,
        time: time,
        hostname: process.env['HOSTNAME']
    });
};

module.exports.ContextLogger = ContextLogger;

/**
 * Creates a new context-based logger.
 *
 * @param {Application.Context} ctx Koa context
 * @returns {ContextLogger}
 */
module.exports.withContext = function (ctx) {
    return new ContextLogger(log, ctx);
};

/**
 * Creates a new logger without context.
 * 
 * @returns {ContextLogger}
 */
module.exports.noContext = function () {
    return new ContextLogger(log);
};
