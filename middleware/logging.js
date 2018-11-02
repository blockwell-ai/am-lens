const conf = require('../config');
const log = require('../log');

/**
 * Adds the `ctx.log` logging utility, and logs requests when configured.
 */
module.exports = async function requestLogger(ctx, next) {
    const start = Date.now();
    ctx.log = log.withContext(ctx);

    try {
        await next();
    } finally {
        if (conf.get('log_requests')) {
            const ms = Date.now() - start;
            log.request(ctx, ms);
        }
    }
};
