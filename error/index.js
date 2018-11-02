const VError = require('verror');

exports.error = function (message, data, cause) {
    return new VError({
        name: 'InternalError',
        cause: cause,
        info: {
            message: message,
            data: data
        }
    }, message);
};

exports.authError = function (message, data, cause) {
    return new VError({
        name: 'AuthError',
        cause: cause,
        info: {
            data: data
        }
    }, message);
};

exports.httpError = function (status, code, message, data, cause) {
    return new VError({
        name: 'HttpError',
        cause: cause,
        info: {
            status: status,
            code: code,
            message: message,
            data: data
        }
    }, `${code}: ${message}`);
};

exports.badRequest = function (message, data, cause) {
    return exports.httpError(400, "bad_request", message, data, cause);
};

exports.unauthorized = function (message, data, cause) {
    return exports.httpError(401, "unauthorized", message, data, cause);
};

exports.forbidden = function (message, data, cause) {
    return exports.httpError(403, "forbidden", message, data, cause);
};

exports.notFound = function (message, data, cause) {
    return exports.httpError(404, "not_found", message, data, cause);
};

exports.internal = function (message, data, cause) {
    return exports.httpError(500, "internal", message, data, cause);
};

exports.badGateway = function (message, data, cause) {
    return exports.httpError(502, "bad_gateway", message, data, cause);
};

exports.VError = VError;
