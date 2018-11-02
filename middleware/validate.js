const Joi = require('joi');
const err = require('../error');

/**
 * Validation middleware for Koa2.
 *
 * The *Object parameters allow passing a Joi object directly instead of just the keys.
 *
 * @param {Object} validation
 * @param {Object?} validation.query Query parameter schema
 * @param {Object?} validation.body Body schema
 * @param {Object?} validation.params Parameters schema
 * @param {Boolean} allowUnknown (Optional) Whether or not to allow unknown fields in the request body. Defaults to true.
 *
 * @returns {Function} Middleware function for Koa
 */
function validate(validation, allowUnknown = true) {
    return async (ctx, next) => {
        let errors = [];
        if (validation.query && ctx.query) {
            let {error, value} = Joi.validate(ctx.query, validation.query, {presence: "required"});

            if (error) {
                errors.push(error);
            } else {
                ctx.query = value;
            }
        }

        if (validation.body && ctx.request.body) {
            let {error, value} = Joi.validate(ctx.request.body, validation.body, { presence: "required", allowUnknown });

            if (error) {
                errors.push(error);
            } else {
                ctx.request.body = value;
            }
        }
        if (validation.params && ctx.params) {
            let {error, value} = Joi.validate(ctx.params, validation.params, { presence: "required" });

            if (error) {
                errors.push(error);
            } else {
                ctx.params = value;
            }
        }

        if (errors.length > 0) {
            throw err.badRequest("Request validation failed", {
                // Turn the error messages into a single array
                reason: errors.map(it => it.details.map(error => error.message))
                    .reduce((prev, curr) => prev.concat(curr))
            });
        }
        await next();
    }
}

module.exports = validate;
