/**
 * Database abstraction layer for Users.
 */

/**
 * @type {Knex}
 */
const db = require('../db');

/**
 * Base function for getting a user by ID.
 *
 * @param {Array} fields Fields to select
 * @param {Number} id User ID
 * @returns {Bluebird<Object>}
 * @private
 */
function _get(fields, id) {
    return db
        .first(fields)
        .from('users')
        .where('id', id)
        .then(deserialize);
}

function deserialize(user) {
    if (!user) {
        return null;
    }

    let ret = Object.assign({}, user);
    if (user.auth) {
        ret.auth = JSON.parse(user.auth);
    }
    if (user.data) {
        ret.data = JSON.parse(user.data);
    }
    return ret;
}

/**
 * Get a user by ID.
 *
 * @param {Number} id User ID
 * @returns {Bluebird<Object>} User data
 */
function get(id) {
    return _get(['id', 'email', 'auth', 'data', 'apiminerId', 'created_at'], id);
}

/**
 * Get the user's hashed password.
 *
 * @param {Number} id User ID
 * @returns {Bluebird<String>} Hashed password
 */
function getPassword(id) {
    return _get(['password'], id).then(it => it.password);
}

/**
 * Get the user's API Miner token.
 *
 * @param {Number} id User ID
 * @returns {Bluebird<String>} API Miner token
 */
function getApiminerToken(id) {
    return _get(['apiminerToken'], id).then(it => it.apiminerToken);
}

/**
 * Find a user by email address.
 *
 * @param {String} email User email address
 * @returns {Bluebird<{id: Number, auth: Object, data: Object}>}
 */
function find(email) {
    return db
        .first('id', 'email', 'auth', 'data')
        .from('users')
        .where('email', email)
        .then(deserialize);
}

/**
 * Creates a user in the database.
 *
 * @param {String} email User email
 * @param {Object} auth Auth data
 * @returns {Bluebird<Object>}
 */
function create(email, auth) {
    return db
        .table('users')
        .insert({
            email: email,
            auth: JSON.stringify(auth),
            data: '{}'
        })
        .then(id => {
            return get(id[0]);
        });
}

/**
 * Updates the user in the database.
 *
 * The user parameter must have its `id` set already.
 *
 * @param {Object} user User data
 * @returns {Bluebird<Boolean>} Resolves true when successful
 */
function update(user) {
    let insert = Object.assign({}, user);
    insert.auth = JSON.stringify(user.auth);
    insert.data = JSON.stringify(user.data);

    return db
        .table('users')
        .where('id', user.id)
        .update(insert)
        .return(true);
}

module.exports = {
    get,
    getPassword,
    getApiminerToken,
    find,
    create,
    update
};
