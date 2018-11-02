const VError = require('verror');
const R = require('rambdax');

class ContextLogger {

    /**
     * Constructor
     *
     * @param {Logger} winston
     * @param {Application.Context?} ctx
     */
    constructor(winston, ctx) {
        this.winston = winston;
        this.ctx = ctx;
    }

    /**
     * Transforms log data for better logging.
     *
     * Primarily turns errors into objects.
     *
     * @param {Object} inputData
     * @returns {Object|undefined}
     */
    transformData(inputData) {
        if (!inputData) {
            return undefined;
        }

        // Map over object
        return R.map((it) => {
            if (it instanceof VError) {
                let obj = {};
                obj.name = it.name;
                obj.message = it.message;
                obj.stack = VError.fullStack(it);

                // Recurse the causes and combine the data values
                let info = {};
                let cause = VError.cause(it);
                while (cause) {
                    let causeInfo = VError.info(cause);
                    if (causeInfo.data) {
                        info = Object.assign(info, causeInfo.data);
                    }
                    cause = VError.cause(cause);
                }
                return obj;
            } else if (it instanceof Error) {
                let obj = Object.assign({}, it);

                // These are not iterable fields
                obj = Object.assign(obj, R.pick(['name', 'message', 'stack', 'code']));
                return obj;
            } else {
                return it;
            }
        }, inputData);
    }

    /**
     * Get context information for logging, if any.
     *
     * @returns {Object|undefined}
     */
    contextData() {
        if (!this.ctx) {
            return undefined;
        }

        if (!this.ctxData) {
            this.ctxData = R.pick([
                'x-real-ip',
                'x-original-uri',
                'x-request-id',
                'user-id'
            ], this.ctx.headers)
        }
        return this.ctxData;
    }

    /**
     * Log a message with the given parameters.
     *
     * @param {String} level Log level
     * @param {String} message Log message
     * @param {Object?} data (Optional) Additional log data
     */
    log(level, message, data) {
        const context = this.contextData();
        this.winston.log({
            level: level,
            message: message,
            data: this.transformData(data),
            context: context,
            hostname: process.env['HOSTNAME']
        });
    }

    error(message, data) {
        this.log('error', message, data);
    }

    warn(message, data) {
        this.log('warn', message, data);
    }

    info(message, data) {
        this.log('info', message, data);
    }

    verbose(message, data) {
        this.log('info', message, data);
    }

    debug(message, data) {
        this.log('info', message, data);
    }

    silly(message, data) {
        this.log('info', message, data);
    }
}

module.exports = ContextLogger;
