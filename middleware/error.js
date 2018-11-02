const conf = require('../config');
const VError = require('verror');

module.exports = async function errorMiddleware(ctx, next) {
    try {
        await next();
    } catch (e) {
        if (VError.hasCauseWithName(e, 'HttpError')) {
            const info = VError.info(e);
            ctx.log.debug("VError", {info: info});
            ctx.status = info.status;
            ctx.body = {
                error: {
                    code: info.code,
                    message: info.message
                }
            };
            ctx.log.error(e.message, {
                err: e,
                status: info.status,
                code: info.code,
                stack: VError.fullStack(e)
            });
        } else {
            ctx.status = 500;
            ctx.body = {
                error: {
                    message: e.message
                }
            };
            ctx.log.error(e.message, {
                code: e.code,
                stack: e.stack
            });
        }
    }
};
